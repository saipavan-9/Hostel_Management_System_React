const Bill = require("../models/Bill");
const Resident = require("../models/Resident");
const Room = require("../models/Room");

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// 1️⃣ Generate Monthly Bills
const generateMonthlyBills = async (req, res) => {
  const { hostelId } = req.params;
  const month = getCurrentMonth();

  try {
    const rooms = await Room.find({ hostelId }).populate("residents");

    const billsToSave = [];

    for (const room of rooms) {
      for (const resident of room.residents) {
        const existing = await Bill.findOne({ residentId: resident._id, month });
        if (!existing) {
          billsToSave.push({
            residentId: resident._id,
            roomId: room._id,
            amount: room.rent,
            month,
            status: "Unpaid"
          });
        }
      }
    }

    if (billsToSave.length > 0) {
      await Bill.insertMany(billsToSave);
    }

    res.json({ message: "Bills generated for " + month });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2️⃣ Get Bills by Hostel
const getBills = async (req, res) => {
  const { hostelId } = req.params;

  try {
    const rooms = await Room.find({ hostelId });
    const roomIds = rooms.map(r => r._id);

    const bills = await Bill.find({ roomId: { $in: roomIds } })
      .populate("residentId")
      .sort({ month: -1 });

    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3️⃣ Update Bill Status
const updateBillStatus = async (req, res) => {
  const { billId } = req.params;
  const { status } = req.body;

  try {
    const bill = await Bill.findByIdAndUpdate(billId, { status }, { new: true });
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    res.json({ message: "Bill status updated", bill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  generateMonthlyBills,
  getBills,
  updateBillStatus
};
