const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/sign-up", userController.user_create_get);

router.get("/login", userController.user_login_get);

router.post("/sign-up", userController.user_create_post);

router.post("/login", userController.user_login);

router.get("/log-out", userController.user_logout);

router.get("/new-message", userController.message_create_get);

router.post("/new-message", userController.message_create_post);

module.exports = router;
