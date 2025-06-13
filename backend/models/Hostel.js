const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
  name: String,
  address: String,
  description: String,
  logo: String
}, { timestamps: true });

module.exports = mongoose.model("Hostel", hostelSchema);
