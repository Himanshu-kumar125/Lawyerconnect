const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    lawyerId: {
      type: String,
      required: true,
    },
    sender: {
      type: String, // "user" or "lawyer"
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
