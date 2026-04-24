const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate access token (short-lived)
const generateAccessToken = (userId, email, role) => {
  return jwt.sign(
    {
      id: userId,
      email,
      role,
      type: 'access'
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m' // 15 minutes
    }
  );
};

// Generate refresh token (long-lived)
const generateRefreshToken = async (userId, prisma) => {
  const token = crypto.randomBytes(40).toString('hex');

  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: hashedToken,
      userId,
      expiresAt
    }
  });

  return token;
};

// Verify access token
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'access') return null;
    return decoded;
  } catch (error) {
    return null;
  }
};

// Verify refresh token
const verifyRefreshToken = async (token, prisma) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        token: hashedToken,
        isRevoked: false,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true
          }
        }
      }
    });

    if (!refreshToken || !refreshToken.user || !refreshToken.user.isActive) {
      return null;
    }

    return refreshToken;
  } catch (error) {
    return null;
  }
};

// Revoke refresh token (logout)
const revokeRefreshToken = async (token, prisma) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    await prisma.refreshToken.updateMany({
      where: { token: hashedToken },
      data: { isRevoked: true }
    });
    return true;
  } catch (error) {
    return false;
  }
};

// Revoke all user refresh tokens (password change)
const revokeAllUserTokens = async (userId, prisma) => {
  try {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true }
    });
    return true;
  } catch (error) {
    return false;
  }
};

// Clean expired tokens (run periodically)
const cleanExpiredTokens = async (prisma) => {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });
    return result.count;
  } catch (error) {
    return 0;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  cleanExpiredTokens
};