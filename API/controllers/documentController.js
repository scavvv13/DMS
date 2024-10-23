const DocumentModel = require("../models/DocumentModel");
const bucket = require("../config/firebase");
const UserModel = require("../models/UserModel");
const { v4: uuidv4 } = require("uuid");
const { getSignedUrl } = require("@google-cloud/storage");
const { createNotification } = require("../utils/NotificationUtil");

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
      return res.status(500).json({ message: "Upload failed", error: err });
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
        documentUploader, // Ensure this is a valid ObjectId
        haveAccess: haveAccess || [],
      });

      await document.save();

      // Create notification for document upload
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

// Get Documents (with Signed URLs)
// Get Documents (with Signed URLs)
exports.getDocuments = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the request

    // Find documents uploaded by the user or shared with them
    const documents = await DocumentModel.find({
      $or: [
        { documentUploader: userId }, // Documents uploaded by the user
        { haveAccess: userId }, // Documents shared with the user
      ],
    })
      .populate("documentUploader", "name email")
      .populate("haveAccess", "name email");

    // Generate signed URLs for secure access
    for (let doc of documents) {
      const file = bucket.file(doc.documentPath); // Use the documentPath stored in MongoDB
      const [signedUrl] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 15 * 60 * 1000, // Signed URL valid for 15 minutes
      });
      doc.documentImageURL = signedUrl; // Replace the documentImageURL with the signed URL
    }

    res.status(200).json({ documents });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving documents", error: err });
  }
};

// Delete Document (from Firebase and MongoDB)
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await DocumentModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const file = bucket.file(document.documentPath);
    await file.delete();
    await DocumentModel.findByIdAndDelete(id);

    // Create notification for document deletion
    await createNotification(
      document.documentUploader,
      "Document Deleted",
      `${document.documentName} has been deleted.`
    );

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting document", error: err });
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
