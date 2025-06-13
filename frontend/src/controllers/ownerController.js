const Room = require("../models/Room");
const Resident = require("../models/Resident");
const Bill = require("../models/Bill");
const Hostel = require("../models/Hostel");

const getOwnerStats = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ ownerId: req.user.id });
    if (!hostel) return res.json({ totalRooms: 0, totalResidents: 0, revenue: 0 });

    const rooms = await Room.find({ hostelId: hostel._id });
    const roomIds = rooms.map((r) => r._id);

    const residents = await Resident.find({ roomId: { $in: roomIds } });
    const bills = await Bill.find({ roomId: { $in: roomIds }, month: getCurrentMonth() });

    const revenue = bills
      .filter((b) => b.status === "Paid")
      .reduce((sum, b) => sum + b.amount, 0);

    res.json({
      totalRooms: rooms.length,
      totalResidents: residents.length,
      revenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};
