const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalid" });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
