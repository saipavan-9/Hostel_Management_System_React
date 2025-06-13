const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  fullName: String,
  mobile: String,
  email: { type: String, unique: true },
  password: String,
  address: String,
  status: { type: String, default: "Pending" },
  logo: String,
  ownerLicense: String,
  hostelLicense: String,
  ownerProof: String,
  hostelProof: String,

}, { timestamps: true });

module.exports = mongoose.model("Owner", ownerSchema);
