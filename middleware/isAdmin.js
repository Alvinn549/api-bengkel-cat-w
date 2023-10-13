const { User } = require("../db/models");

const isAdmin = async (req, res, next) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({
      where: { refresh_token },
    });

    if (!user) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

module.exports = { isAdmin };
