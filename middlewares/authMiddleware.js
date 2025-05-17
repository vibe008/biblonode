const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorizedmiddle" });

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decode",decode)
    req.user = decode;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


module.exports = authMiddleware;