const MemoModel = require("../models/MemoModel");

// POST: Create a new memo
exports.postMemo = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const memo = new MemoModel({
      MemoTitle: title,
      MemoContent: content,
    });

    await memo.save(); // Corrected variable name here

    res.status(201).json({ message: "Memo uploaded successfully", memo });
  } catch (err) {
    res.status(500).json({ message: "Error uploading memo", error: err });
  }
};

// DELETE: Delete a memo by ID
exports.deleteMemo = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL params

    const deletedMemo = await MemoModel.findByIdAndDelete(id); // Delete memo by ID

    if (!deletedMemo) {
      return res.status(404).json({ message: "Memo not found" });
    }

    res
      .status(200)
      .json({ message: "Memo deleted successfully", memo: deletedMemo });
  } catch (err) {
    res.status(500).json({ message: "Error deleting memo", error: err });
  }
};

// GET: Retrieve all memos
exports.getMemos = async (req, res) => {
  try {
    const memos = await MemoModel.find(); // Fetch all memos from the database

    res.status(200).json({ message: "Memos retrieved successfully", memos });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving memos", error: err });
  }
};

// PUT: Update an existing memo by ID
exports.updateMemo = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL params
    const { title, content } = req.body;

    // Check if both title and content are provided
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required." });
    }

    const updatedMemo = await MemoModel.findByIdAndUpdate(
      id,
      { MemoTitle: title, MemoContent: content }, // Update fields
      { new: true } // Return the updated document
    );

    if (!updatedMemo) {
      return res.status(404).json({ message: "Memo not found." });
    }

    res
      .status(200)
      .json({ message: "Memo updated successfully", memo: updatedMemo });
  } catch (err) {
    res.status(500).json({ message: "Error updating memo", error: err });
  }
};
