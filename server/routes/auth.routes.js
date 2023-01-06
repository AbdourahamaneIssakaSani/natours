const express = require("express");
const AuthController = require("../controllers/auth.controller");
const AuthGuard = require("../middlewares/auth.guard");

const router = express.Router();

// public routes

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/forgot-pwd", AuthController.forgotPassword);
router.patch("/reset-pwd/:token", AuthController.resetPassword);

// // protect routes below
router.use(AuthGuard.protect);
router.patch("/update-pwd", AuthController.updatePassword);

module.exports = router;
