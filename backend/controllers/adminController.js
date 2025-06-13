const Owner = require("../models/Owner");
const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const Resident = require("../models/Resident");
const Bill = require("../models/Bill");



// Middleware to ensure only admin can proceed
const isAdmin = (user) => user.role === "admin";

const getPendingOwners = async (req, res) => {
  if (!isAdmin(req.user)) return res.status(403).json({ message: "Access denied" });

  try {
    const pending = await Owner.find({ status: "Pending" });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveOwner = async (req, res) => {
  if (!isAdmin(req.user)) return res.status(403).json({ message: "Access denied" });

  try {
    const owner = await Owner.findByIdAndUpdate(req.params.id, { status: "Approved" }, { new: true });
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    res.json({ message: "Owner approved", owner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rejectOwner = async (req, res) => {
  if (!isAdmin(req.user)) return res.status(403).json({ message: "Access denied" });

  try {
    const owner = await Owner.findByIdAndUpdate(req.params.id, { status: "Rejected" }, { new: true });
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    res.json({ message: "Owner rejected", owner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find().populate("ownerId", "fullName email");

    const hostelsWithRevenue = await Promise.all(
      hostels.map(async (hostel) => {
        const rooms = await Room.find({ hostelId: hostel._id });
        const roomIds = rooms.map((r) => r._id);

        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        const bills = await Bill.find({
          roomId: { $in: roomIds },
          month: currentMonth,
          status: "Paid",
        });

        const revenue = bills.reduce((sum, b) => sum + b.amount, 0);

        return {
          ...hostel.toObject(),
          revenue,
        };
      })
    );

    res.json(hostelsWithRevenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



const getResidentsByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const rooms = await Room.find({ hostelId });
    const roomIds = rooms.map(r => r._id);
    const residents = await Resident.find({ roomId: { $in: roomIds } });
    res.json(residents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getPendingOwners,
  approveOwner,
  rejectOwner,
  getAllHostels,
  getResidentsByHostel
};

