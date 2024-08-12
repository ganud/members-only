const express = require("express");
const messageController = require("../controllers/messageController");
const router = express.Router();

// Home
router.get("/", messageController.getIndex);

router.get("/new-message", messageController.message_create_get);

router.post("/new-message", messageController.message_create_post);

router.get("/delete/:id", messageController.message_delete_get);

router.post("/delete/:id", messageController.message_delete_post);

module.exports = router;
