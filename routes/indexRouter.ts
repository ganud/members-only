const express = require("express");
const indexController = require("../controllers/indexController");
const router = express.Router();

// Home
router.get("/", indexController.getIndex);

module.exports = router;
