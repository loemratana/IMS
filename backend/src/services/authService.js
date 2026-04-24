const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma = require("../config/database");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
} = require("../config/jwt");
const { validateEmail, validatePassword } = require("../utils/validation");
const emailService = require('../models/email/email.service');


class AuthService {
  async register({ name, email, password, role }) {
    if (!name || !name.trim()) throw new Error("NAME_REQUIRED");
    if (!email) throw new Error("EMAIL_REQUIRED");
    if (!validateEmail(email)) throw new Error("INVALID_EMAIL");
    if (!password) throw new Error("PASSWORD_REQUIRED");
    if (!validatePassword(password)) throw new Error("PASSWORD_TOO_SHORT");

    const emailNorm = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (existing) throw new Error("USER_ALREADY_EXISTS");

    const validRoles = ["ADMIN", "MANAGER", "STAFF"];
    const roleValue = validRoles.includes(String(role || "STAFF").toUpperCase())
      ? String(role || "STAFF").toUpperCase()
      : "STAFF";

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    );

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: emailNorm,
        password: hashedPassword,
        role: roleValue,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    await emailService.sendWelcomeEmail(user.email, user.name);

    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = await generateRefreshToken(user.id, prisma);

    return { user, accessToken, refreshToken };
  }

  async login(email, password) {
    if (!email || !password) throw new Error("INVALID_CREDENTIALS");
    const emailNorm = String(email).toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (!user) throw new Error("INVALID_CREDENTIALS");
    if (!user.isActive) throw new Error("ACCOUNT_INACTIVE");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("INVALID_CREDENTIALS");

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = await generateRefreshToken(user.id, prisma);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token) {
    if (!token) throw new Error("NO_REFRESH_TOKEN");
    const record = await verifyRefreshToken(token, prisma);
    if (!record) throw new Error("INVALID_REFRESH_TOKEN");

    const accessToken = generateAccessToken(
      record.user.id,
      record.user.email,
      record.user.role,
    );

    return { accessToken, expiresIn: process.env.JWT_EXPIRES_IN || "15m" };
  }

  async logout(refreshToken, accessToken) {
    if (refreshToken) {
      await revokeRefreshToken(refreshToken, prisma);
    }
    if (accessToken) {
      await prisma.blacklistedToken.create({
        data: {
          token: accessToken,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    }
    return true;
  }

  async getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new Error("USER_NOT_FOUND");
    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("USER_NOT_FOUND");

    const currentOk = await bcrypt.compare(currentPassword, user.password);
    if (!currentOk) throw new Error("INVALID_CURRENT_PASSWORD");
    if (!validatePassword(newPassword)) throw new Error("PASSWORD_TOO_SHORT");

    const same = await bcrypt.compare(newPassword, user.password);
    if (same) throw new Error("PASSWORD_SAME_AS_OLD");

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    await revokeAllUserTokens(userId, prisma);
    return true;
  }

  async forgotPassword(email) {
    if (!email) throw new Error("EMAIL_REQUIRED");
    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase().trim() },
    });
    if (!user) return {};

    const resetToken = crypto.randomBytes(24).toString("hex");
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
    return { resetUrl };
  }

  async resetPassword(email, token, newPassword) {
    if (!email || !token || !newPassword) throw new Error("INVALID_RESET_TOKEN");
    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase().trim() },
    });
    if (!user) throw new Error("USER_NOT_FOUND");
    await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);

    if (!validatePassword(newPassword)) throw new Error("PASSWORD_TOO_SHORT");

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    await revokeAllUserTokens(user.id, prisma);
    return true;
  }

  async verifyEmail() {
    await emailService.sendVerificationEmail(user.email, user.name, verificationToken);
    return true;
  }

  async resendVerificationEmail() {
    return true;
  }
}

module.exports = new AuthService();
