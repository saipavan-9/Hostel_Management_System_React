const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  name: String,
  mobile: String,
  email: String,
  checkInDate: Date,
  checkOutDate: Date,
  billStatus: { type: String, default: "Unpaid" }
}, { timestamps: true });

module.exports = mongoose.model("Resident", residentSchema);
