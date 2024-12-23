const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    documentImageURL: {
      type: String,
    },
    documentName: {
      type: String,
      required: [true, "Document name is required"],
      unique: true,
      trim: true,
    },
    documentSize: {
      type: Number,
      required: [true, "Document size is required"],
      min: [1, "Document size must be greater than 0"],
    },
    documentType: {
      type: String,
      required: [true, "Document type is required"],
    },
    documentPath: {
      type: String,
      required: [true, "Document path is required"],
    },
    documentUploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: [true, "Uploader is required"],
    },
    haveAccess: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder", // Reference to Folder model
      default: null, // If null, the document is not in a folder
    },
  },
  { timestamps: true }
);

const DocumentModel = mongoose.model("Document", DocumentSchema);

module.exports = DocumentModel;
