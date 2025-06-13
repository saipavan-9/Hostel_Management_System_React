const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
  roomNumber: String,
  type: String, // e.g. Single, Double, Dorm
  capacity: Number,
  rent: Number,
  residents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resident" }]
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
