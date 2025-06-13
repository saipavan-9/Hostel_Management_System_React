const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const {
  getPendingOwners,
  approveOwner,
  rejectOwner,
  getAllHostels,
  getResidentsByHostel
} = require("../controllers/adminController");



// All routes protected by token & admin role
router.get("/owners/pending", authenticateToken, getPendingOwners);
router.put("/owners/approve/:id", authenticateToken, approveOwner);
router.put("/owners/reject/:id", authenticateToken, rejectOwner);
router.get("/hostels", authenticateToken, getAllHostels);
router.get("/hostels/:hostelId/residents", authenticateToken, getResidentsByHostel);


module.exports = router;
