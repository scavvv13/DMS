const FolderModel = require("../models/FolderModel");
const { createNotification } = require("../utils/NotificationUtil");

// Create a new folder
// Create a new folder
exports.createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    const createdBy = req.user.id; // Assuming authentication middleware adds `req.user`

    // Validate required fields
    if (!folderName) {
      return res.status(400).json({
        message: "Missing required fields",
        requiredFields: { folderName },
      });
    }

    // Create folder
    const folder = new FolderModel({
      folderName,
      createdBy,
    });

    await folder.save();

    res.status(201).json({ message: "Folder created successfully", folder });
  } catch (err) {
    console.error("Error creating folder:", err);
    res
      .status(500)
      .json({ message: "Error creating folder", error: err.message });
  }
};

// Get folders under a specific parent folder
exports.getFolders = async (req, res) => {
  try {
    const folders = await FolderModel.find({}).populate(
      "createdBy",
      "name email"
    ); // Optional: populate user info

    res.status(200).json({ folders });
  } catch (err) {
    console.error("Error fetching folders:", err);
    res
      .status(500)
      .json({ message: "Error fetching folders", error: err.message });
  }
};

// Rename a folder
exports.renameFolder = async (req, res) => {
  const { folderId } = req.params;
  const { newFolderName } = req.body;

  try {
    if (!newFolderName) {
      return res.status(400).json({ message: "New folder name is required" });
    }

    const updatedFolder = await FolderModel.findByIdAndUpdate(
      folderId,
      { folderName: newFolderName },
      { new: true }
    );

    if (!updatedFolder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res
      .status(200)
      .json({ message: "Folder renamed successfully", folder: updatedFolder });
  } catch (err) {
    console.error("Error renaming folder:", err);
    res
      .status(500)
      .json({ message: "Error renaming folder", error: err.message });
  }
};

// Delete a folder (and optionally its children)
exports.deleteFolder = async (req, res) => {
  const { folderId } = req.params;

  try {
    const deletedFolder = await FolderModel.findByIdAndDelete(folderId);

    if (!deletedFolder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Optionally: delete subfolders
    await FolderModel.deleteMany({ parentFolder: folderId });

    // Optionally: create a notification
    await createNotification(
      deletedFolder.createdBy,
      "Folder Deleted",
      `The folder "${deletedFolder.folderName}" has been deleted.`
    );

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (err) {
    console.error("Error deleting folder:", err);
    res
      .status(500)
      .json({ message: "Error deleting folder", error: err.message });
  }
};

// Get folder details
exports.getFolderDetails = async (req, res) => {
  const { folderId } = req.params;

  try {
    const folder = await FolderModel.findById(folderId).populate(
      "createdBy",
      "name email"
    );

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json({ folder });
  } catch (err) {
    console.error("Error fetching folder details:", err);
    res
      .status(500)
      .json({ message: "Error fetching folder details", error: err.message });
  }
};
