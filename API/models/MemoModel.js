const mongoose = require("mongoose");

const MemoSchema = new mongoose.Schema(
  {
    MemoTitle: {
      type: String,
      required: true,
    },

    MemoContent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MemoModel = mongoose.model("Memo", MemoSchema);

module.exports = MemoModel;
