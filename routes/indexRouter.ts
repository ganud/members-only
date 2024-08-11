const express = require("express");
const indexController = require("../controllers/indexController");
const router = express.Router();
const pool = require("../db/pool");

// Home
router.get("/", indexController.getIndex);

module.exports = router;
