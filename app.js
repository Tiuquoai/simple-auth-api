const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // nếu muốn test cookie thủ công
const authRoutes = require('./routes/authRoutes');

// Load biến môi trường từ file .env
dotenv.config();

const app = express();

// Middleware parse body & cookie
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Session config - lưu session vào MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,      // link MongoDB trong .env
      collectionName: 'sessions',           // tên collection
      ttl: 24 * 60 * 60                     // thời gian sống: 1 ngày
    }),
    cookie: {
      secure: false, // đổi true nếu chạy HTTPS
      httpOnly: true // bảo mật hơn, cookie chỉ dùng qua HTTP
    }
  })
);

// Routes auth
app.use('/auth', authRoutes);

// Route test
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Simple Auth API' });
});

// Route test cookie (tùy chọn, chỉ để nghịch cookie-parser)
app.get('/set-cookie', (req, res) => {
  res.cookie('theme', 'dark');
  res.json({ message: 'Cookie theme=dark đã được set' });
});

app.get('/get-cookie', (req, res) => {
  res.json({ cookies: req.cookies });
});

// Connect DB & start server
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ Failed to connect MongoDB:', err.message);
    process.exit(1); // Dừng server nếu không kết nối được DB
  });
