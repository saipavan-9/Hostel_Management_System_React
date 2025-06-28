const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
console.log("Loaded MONGO_URI:", process.env.MONGO_URI); // Debug print

connectDB();

const app = express();

// === CORS SETUP ===
const allowedOrigins = ['http://localhost:5173', 'http://192.168.0.7:5174'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Only enable CORS during development
if (process.env.NODE_ENV === 'development') {
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
}

// === BODY PARSER ===
app.use(express.json());

// === STATIC FILES ===
app.use('/uploads', express.static('uploads'));

// === API ROUTES ===
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/owner', require('./routes/ownerRoutes'));

// === SERVE FRONTEND BUILD ===
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// === START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
