const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");
const { getUserProfile } = require("../controllers/userController");

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
