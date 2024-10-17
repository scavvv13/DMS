const DocumentModel = require("../models/DocumentModel");
const bucket = require("../config/firebase");
const UserModel = require("../models/UserModel");
const { v4: uuidv4 } = require("uuid");
const { getSignedUrl } = require("@google-cloud/storage");

// Upload Document
exports.postDocument = async (req, res) => {
  try {
    const { documentName, documentType, documentUploader, haveAccess } =
      req.body;
    const file = req.file; // Assuming you're using multer to handle file uploads

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Firebase Cloud Storage
    const blob = bucket.file(`${uuidv4()}-${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      return res.status(500).json({ message: "Upload failed", error: err });
    });

    blobStream.on("finish", async () => {
      // Get file path (not a public URL, but the reference path in Firebase Storage)
      const documentPath = blob.name;
      const documentSize = file.size;

      // Save document details in MongoDB
      const document = new DocumentModel({
        documentImageURL: documentPath, // Save the Firebase path, not the public URL
        documentName,
        documentSize,
        documentType,
        documentPath,
        documentUploader, // Ensure this is a valid ObjectId
        haveAccess: haveAccess || [], // Set to empty array if not provided
      });

      await document.save();

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

    // Delete file from Firebase Storage
    const file = bucket.file(document.documentPath);
    await file.delete();

    // Remove document from MongoDB
    await DocumentModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting document", error: err });
  }
};

// Share Document
exports.shareDocument = async (req, res) => {
  try {
    const { email } = req.body; // Get email from request body
    const { id } = req.params;

    const document = await DocumentModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has access
    if (document.haveAccess.includes(user._id)) {
      return res.status(400).json({ message: "User already has access" });
    }

    // Add user to haveAccess array
    document.haveAccess.push(user._id);
    await document.save();

    res.status(200).json({ message: "Document shared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error sharing document", error: err });
  }
};

// Remove Access
exports.removeAccess = async (req, res) => {
  try {
    const { email } = req.body; // Get email from request body
    const { id } = req.params;

    const document = await DocumentModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has access
    if (!document.haveAccess.includes(user._id)) {
      return res.status(400).json({ message: "User does not have access" });
    }

    // Remove user from haveAccess array
    document.haveAccess = document.haveAccess.filter(
      (userId) => !userId.equals(user._id)
    );
    await document.save();

    res.status(200).json({ message: "Access removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error removing access", error: err });
  }
};
