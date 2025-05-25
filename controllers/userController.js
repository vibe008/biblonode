const User = require("../models/User");

exports.getUserByID = async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug });
    if (!user) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};