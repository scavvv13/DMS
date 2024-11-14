const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const DocumentModel = require("../models/DocumentModel");
const bucket = require("../config/firebase");
const { createNotification } = require("../utils/NotificationUtil");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const UserModel = require("../models/UserModel");

// Multer setup for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory before uploading to Firebase
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

exports.postDocument = async (req, res) => {
  try {
    const { documentName, documentUploader, documentType, haveAccess } =
      req.body;
    const file = req.file; // Multer adds the uploaded file here

    // Debugging: Log file and body data
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    // Check if file is provided
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Validate required fields
    if (!documentName || !documentUploader || !documentType) {
      return res.status(400).json({
        message: "Missing required fields",
        requiredFields: { documentName, documentUploader, documentType },
      });
    }

    // Create a unique filename and upload to Firebase
    const blob = bucket.file(`${uuidv4()}-${file.originalname}`);
    const blobStream = blob.createWriteStream({ resumable: false });

    blobStream.on("error", (err) => {
      res.status(500).json({ message: "Upload failed", error: err });
    });

    blobStream.on("finish", async () => {
      const documentPath = blob.name;
      const documentSize = file.size;

      const document = new DocumentModel({
        documentImageURL: documentPath,
        documentName,
        documentSize,
        documentType,
        documentPath,
        documentUploader,
        haveAccess: haveAccess || [],
      });

      await document.save();

      // Optionally, create a notification for the upload
      await createNotification(
        documentUploader,
        "New Document Uploaded",
        `${documentName} has been uploaded.`
      );

      res
        .status(201)
        .json({ message: "Document uploaded successfully", document });
    });

    blobStream.end(file.buffer);
  } catch (err) {
    console.error("Error uploading document:", err);
    res
      .status(500)
      .json({ message: "Error uploading document", error: err.message });
  }
};

// Download Document
exports.downloadDocument = async (req, res) => {
  try {
    const { fileName } = req.params;

    if (!fileName) {
      return res.status(400).json({ message: "File name not provided" });
    }

    console.log("Requested file name:", fileName);

    // Reference the file in Firebase Storage
    const file = bucket.file(fileName);

    // Get signed URL for the file with Content-Disposition header to force download
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      responseDisposition: `attachment; filename="${fileName}"`, // Force download
      // Remove contentType if not necessary to avoid header issues
    });

    // Return the signed URL in the response
    res.status(200).json({
      message: "File available for download",
      downloadUrl: signedUrl,
    });
  } catch (err) {
    console.error("Error in downloadDocument:", err);
    res.status(500).json({ message: "Error downloading document", error: err });
  }
};

// Get Documents (with Signed URLs)
exports.getDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    const documents = await DocumentModel.find({
      $or: [{ documentUploader: userId }, { haveAccess: userId }],
    })
      .populate("documentUploader", "name email")
      .populate("haveAccess", "name email");

    // Generate signed URLs concurrently using Promise.all
    const documentsWithSignedUrls = await Promise.all(
      documents.map(async (doc) => {
        const file = bucket.file(doc.documentPath);
        const [signedUrl] = await file.getSignedUrl({
          version: "v4",
          action: "read",
          expires: Date.now() + 15 * 60 * 1000,
        });
        return { ...doc.toObject(), documentImageURL: signedUrl };
      })
    );

    res.status(200).json({ documents: documentsWithSignedUrls });
  } catch (err) {
    console.error("Error in getDocuments:", err);
    res.status(500).json({ message: "Error retrieving documents", error: err });
  }
};

// Delete Document (from Firebase and MongoDB)
// In documentController.js
exports.deleteDocument = async (req, res = null) => {
  try {
    const { id } = req.params;
    const document = await DocumentModel.findById(id);

    if (!document) {
      // If res is provided, send a response; otherwise, just return the error
      if (res) {
        return res.status(404).json({ message: "Document not found" });
      } else {
        throw new Error("Document not found");
      }
    }

    // Perform document deletion
    await DocumentModel.findByIdAndDelete(id);

    // If res is provided, send success response
    if (res) {
      return res
        .status(200)
        .json({ success: true, message: "Document deleted successfully" });
    }

    // Return success if res is not provided
    return { success: true, message: "Document deleted successfully" };
  } catch (error) {
    console.error(`Failed to delete document: ${req.params.id}`, error);

    // If res is provided, send error response
    if (res) {
      return res.status(500).json({ message: "Failed to delete document" });
    }

    // Throw error to be caught by the calling function if res is not provided
    throw new Error("Failed to delete document");
  }
};

// Share Document
exports.shareDocument = async (req, res) => {
  try {
    const { email, name } = req.body;
    const { id } = req.params;

    console.log(
      "Sharing document:",
      id,
      "with email:",
      email,
      "and name:",
      name
    ); // Log input data

    const document = await DocumentModel.findById(id);
    if (!document) {
      console.log("Document not found");
      return res.status(404).json({ message: "Document not found" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (document.haveAccess.includes(user._id)) {
      console.log("User already has access");
      return res.status(400).json({ message: "User already has access" });
    }

    document.haveAccess.push(user._id);
    await document.save();

    const username = name || "Unknown User";
    console.log("Creating notification for document sharing");

    await createNotification(
      user._id,
      "Document Shared",
      `You have been granted access to "${document.documentName}" by ${username}.`
    );

    res.status(200).json({ message: "Document shared successfully" });
  } catch (err) {
    console.error("Error sharing document:", err);
    res.status(500).json({ message: "Error sharing document", error: err });
  }
};

exports.removeAccess = async (req, res) => {
  try {
    const { email } = req.body;
    const { id } = req.params;

    const document = await DocumentModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!document.haveAccess.includes(user._id)) {
      return res.status(400).json({ message: "User does not have access" });
    }

    document.haveAccess = document.haveAccess.filter(
      (userId) => !userId.equals(user._id)
    );
    await document.save();

    // Create notification for access removal
    await createNotification(
      user._id,
      "Access Removed",
      `Your access to ${document.documentName} has been revoked.`
    );

    res.status(200).json({ message: "Access removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error removing access", error: err });
  }
};

// Count total documents
exports.countDocuments = async (req, res) => {
  try {
    // Use Mongoose's countDocuments method to count all documents
    const documentCount = await DocumentModel.countDocuments();

    res.status(200).json({
      message: "Document count fetched successfully",
      count: documentCount,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching document count",
      error: err,
    });
  }
};

exports.countSharedDocuments = async (req, res) => {
  try {
    // Use MongoDB's $where operator to check if haveAccess array has at least one element
    const sharedDocumentCount = await DocumentModel.countDocuments({
      haveAccess: { $exists: true, $ne: [] }, // Checks that haveAccess exists and is not empty
    });

    res.status(200).json({
      message: "Shared document count fetched successfully",
      count: sharedDocumentCount,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching shared document count",
      error: err,
    });
  }
};
