const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/sign-up", userController.user_create_get);

router.get("/login", userController.user_login_get);

module.exports = router;
