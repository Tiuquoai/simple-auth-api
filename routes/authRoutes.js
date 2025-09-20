const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Đăng ký tài khoản mới
// POST /auth/register
router.post('/register', authController.register);

// Đăng nhập
// POST /auth/login
router.post('/login', authController.login);

// Đăng xuất
// GET /auth/logout
router.get('/logout', authController.logout);

// Lấy thông tin user hiện tại (yêu cầu đã đăng nhập)
// GET /auth/profile
router.get('/profile', authController.profile);

module.exports = router;
