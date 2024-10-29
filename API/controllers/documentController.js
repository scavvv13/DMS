const DocumentModel = require("../models/DocumentModel");
const bucket = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");
const { createNotification } = require("../utils/NotificationUtil");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

// Upload Document
exports.postDocument = async (req, res) => {
  try {
    const { documentName, documentType, documentUploader, haveAccess } =
      req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

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
    res.status(500).json({ message: "Error uploading document", error: err });
  }
};

// Download Document
exports.downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await DocumentModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const file = bucket.file(document.documentPath);

    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000,
    });

    const response = await fetch(signedUrl);
    if (!response.ok) {
      return res
        .status(500)
        .json({ message: "Error downloading file from Firebase" });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.documentName}"`
    );
    res.setHeader("Content-Type", document.documentType);

    response.body.pipe(res);
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

    const document = await DocumentModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (document.haveAccess.includes(user._id)) {
      return res.status(400).json({ message: "User already has access" });
    }

    // Grant access to the user
    document.haveAccess.push(user._id);
    await document.save();

    // Check if req.user.name is defined
    const username = name || "Unknown User"; // Fallback if name is undefined

    // Create notification for document sharing
    await createNotification(
      user._id,
      "Document Shared",
      `You have been granted access to "${document.documentName}" by ${username}.`
    );

    res.status(200).json({ message: "Document shared successfully" });
  } catch (err) {
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
