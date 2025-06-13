const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.0.11:3000",
  "http://124.123.120.85:3000",
  "http://124.123.120.85"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

module.exports = corsOptions;
