const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra input
    if (!username || !password) {
      return res.status(400).json({ message: 'Thiếu username hoặc password' });
    }

    // Kiểm tra user đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User đã tồn tại' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Sai username hoặc password' });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Sai username hoặc password' });
    }

    // Lưu user vào session (ẩn password)
    req.session.user = {
      _id: user._id,
      username: user.username,
    };

    // Set thêm cookie "username" để demo (không bắt buộc)
    res.cookie('username', user.username, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 ngày
    });

    res.json({ message: 'Đăng nhập thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Đăng xuất
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Không thể đăng xuất', error: err.message });
    }

    // Xóa cookie session và cookie phụ
    res.clearCookie('connect.sid');
    res.clearCookie('username');

    res.json({ message: 'Đăng xuất thành công, cookie đã được xóa' });
  });
};

// Lấy thông tin user đang đăng nhập
exports.profile = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }

  res.json({
    message: 'Thông tin user hiện tại',
    user: req.session.user,
  });
};
