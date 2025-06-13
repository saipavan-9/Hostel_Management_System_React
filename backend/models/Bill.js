const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: "Resident", required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  amount: Number,
  month: String, // e.g. "2025-06"
  status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" }
}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);
