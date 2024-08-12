const express = require("express");
const messageController = require("../controllers/messageController");
const router = express.Router();

// Home
router.get("/", messageController.getIndex);

module.exports = router;
