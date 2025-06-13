const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const Resident = require("../models/Resident");
const Bill = require("../models/Bill");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

// 🏨 Hostel
const createHostel = async (req, res) => {
  try {
    const { name, address, description, logo } = req.body;
    const newHostel = new Hostel({
      ownerId: req.user.id,
      name,
      address,
      description,
      logo
    });
    await newHostel.save();
    res.status(201).json(newHostel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ ownerId: req.user.id });
    res.json(hostel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🛏 Room
const createRoom = async (req, res) => {
  try {
    const { hostelId, roomNumber, type, capacity, rent } = req.body;
    const newRoom = new Room({ hostelId, roomNumber, type, capacity, rent });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ hostelId: req.params.hostelId });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👤 Resident
const createResident = async (req, res) => {
  try {
    const { roomId, name, mobile, email, checkInDate } = req.body;
    const newResident = new Resident({ roomId, name, mobile, email, checkInDate });
    const saved = await newResident.save();

    // update Room's resident list
    await Room.findByIdAndUpdate(roomId, { $push: { residents: saved._id } });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getResidents = async (req, res) => {
  try {
    const residents = await Resident.find({ roomId: req.params.roomId });
    res.json(residents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


    const getOwnerStats = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ ownerId: req.user.id });

    if (!hostel) {
      return res.json({ totalRooms: 0, totalResidents: 0, revenue: 0 });
    }

    const rooms = await Room.find({ hostelId: hostel._id });
    const roomIds = rooms.map((r) => r._id);

    const residents = await Resident.find({ roomId: { $in: roomIds } });

    const month = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
    const bills = await Bill.find({
      roomId: { $in: roomIds },
      month,
      status: "Paid",
    });

    const revenue = bills.reduce((sum, bill) => sum + bill.amount, 0);

    res.json({
      totalRooms: rooms.length,
      totalResidents: residents.length,
      revenue
    });
  } catch (err) {
    console.error("getOwnerStats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const exportBillsAsExcel = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ ownerId: req.user.id });
    const rooms = await Room.find({ hostelId: hostel._id });
    const roomIds = rooms.map((r) => r._id);
    const bills = await Bill.find({ roomId: { $in: roomIds } }).populate("residentId");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Billing Report");

    sheet.columns = [
      { header: "Resident", key: "name" },
      { header: "Email", key: "email" },
      { header: "Room ID", key: "roomId" },
      { header: "Month", key: "month" },
      { header: "Amount", key: "amount" },
      { header: "Status", key: "status" },
    ];

    bills.forEach((bill) => {
      sheet.addRow({
        name: bill.residentId?.name,
        email: bill.residentId?.email,
        roomId: bill.roomId,
        month: bill.month,
        amount: bill.amount,
        status: bill.status,
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=billing-report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: "Failed to export Excel" });
  }
};

const exportBillsAsPDF = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ ownerId: req.user.id });
    const rooms = await Room.find({ hostelId: hostel._id });
    const roomIds = rooms.map((r) => r._id);
    const bills = await Bill.find({ roomId: { $in: roomIds } }).populate("residentId");

    const doc = new PDFDocument({ margin: 30 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=billing-report.pdf");

    doc.pipe(res);
    doc.fontSize(16).text("Billing Report", { align: "center" }).moveDown();

    bills.forEach((bill, idx) => {
      doc
        .fontSize(12)
        .text(`${idx + 1}. ${bill.residentId?.name || "-"} (${bill.residentId?.email || "-"})`)
        .text(`Room: ${bill.roomId} | Month: ${bill.month} | ₹${bill.amount} | ${bill.status}`)
        .moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Failed to export PDF" });
  }
};



module.exports = {
  createHostel,
  getHostel,
  createRoom,
  getRooms,
  createResident,
  getResidents,
  getOwnerStats,
  exportBillsAsExcel,
  exportBillsAsPDF
};
