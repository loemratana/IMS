const { verifyAccessToken } = require("../config/jwt");
const prisma = require("../config/database");

const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Not authorized. No token provided.",
        },
      });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Invalid or expired token. Please login again.",
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User no longer exists.",
        },
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: "ACCOUNT_INACTIVE",
          message: "Your account has been deactivated. Please contact admin.",
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      error: {
        code: "AUTH_ERROR",
        message: "Authentication failed.",
      },
    });
  }
};

module.exports = { protect };


