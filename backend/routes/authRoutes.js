const express = require("express");
const router = express.Router();
const { registerOwner, loginOwner, loginAdmin } = require("../controllers/authController");
const upload = require("../middleware/upload");

router.post(
  "/owner/register",
  upload.fields([
    { name: "ownerProof", maxCount: 1 },
    { name: "hostelProof", maxCount: 1 },
  ]),
  registerOwner
);
router.post("/owner/register", registerOwner);
router.post("/owner/login", loginOwner);
router.post("/admin/login", loginAdmin);

module.exports = router;
