const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const {
  createHostel, getHostel, createRoom, getRooms, createResident, getResidents
} = require("../controllers/ownerController");

const { getOwnerStats } = require("../controllers/ownerController");
const { exportBillsAsExcel, exportBillsAsPDF } = require("../controllers/ownerController");



// Hostel
router.post("/hostel", authenticateToken, createHostel);
router.get("/hostel", authenticateToken, getHostel);

// Room
router.post("/rooms", authenticateToken, createRoom);
router.get("/rooms/:hostelId", authenticateToken, getRooms);

// Resident
router.post("/residents", authenticateToken, createResident);
router.get("/residents/:roomId", authenticateToken, getResidents);


const {
  generateMonthlyBills,
  getBills,
  updateBillStatus
} = require("../controllers/billController");

// Billing
router.post("/bills/generate/:hostelId", authenticateToken, generateMonthlyBills);
router.get("/bills/:hostelId", authenticateToken, getBills);
router.put("/bills/status/:billId", authenticateToken, updateBillStatus);
router.get("/dashboard/stats", authenticateToken, getOwnerStats);

router.get("/export/bills/excel", authenticateToken, exportBillsAsExcel);
router.get("/export/bills/pdf", authenticateToken, exportBillsAsPDF);


module.exports = router;
