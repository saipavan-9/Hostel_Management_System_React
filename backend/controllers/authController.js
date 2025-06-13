const Owner = require("../models/Owner");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerOwner = async (req, res) => {
  try {
    const { fullName, mobile, email, password, address } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = new Owner({
  fullName,
  email,
  mobile,
  password: hashedPassword,
  address,
  status: "Pending",
  ownerProof: req.files.ownerProof?.[0]?.filename || "",
  hostelProof: req.files.hostelProof?.[0]?.filename || "",
});

    await newOwner.save();
    res.status(201).json({ message: "Owner registered successfully, pending approval." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ email });

    if (!owner || !(await bcrypt.compare(password, owner.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    if (owner.status !== "Approved")
      return res.status(403).json({ message: "Not yet approved by admin" });

    const token = jwt.sign({ id: owner._id, role: "owner" }, process.env.JWT_SECRET);
    res.json({ token, user: owner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || password !== admin.password)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET);
    res.json({ token, user: admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerOwner, loginOwner, loginAdmin };
