const authService = require('../services/authService');
const logger = require('../utils/logger');

class AuthController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.logout = this.logout.bind(this);
    this.getMe = this.getMe.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.resendVerification = this.resendVerification.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Register new user
   */
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;
      
      const result = await authService.register({ name, email, password, role });
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully'
      });
    } catch (error) {
      this.handleError(error, res, next);
    }
  }

  /**
   * Login user
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip;
      
      const result = await authService.login(email, password, ipAddress);
      
      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
          expiresIn: process.env.JWT_EXPIRES_IN || '15m'
        },
        message: 'Login successful'
      });
    } catch (error) {
      this.handleError(error, res, next);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
      
      const result = await authService.refreshToken(refreshToken);
      
      res.json({
        success: true,
        data: result,
        message: 'Token refreshed successfully'
      });
    } catch (error) {
      this.handleError(error, res, next);
    }
  }

  /**
   * Logout user
   */
  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
      const accessToken = req.headers.authorization?.split(' ')[1];
      
      await authService.logout(refreshToken, accessToken);
      
      // Clear refresh token cookie
      res.clearCookie('refreshToken');
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      this.handleError(error, res, next);
    }
  }

  /**
   * Get current user
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      this.handleError(error, res, next);
    }
  }

  /**
   * Change password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      await authService.changePassword(req.user.id, currentPassword, newPassword);
      
      res.json({
        success: true,
        message: 'Password changed successfully. Please login again.'
      });
    } catch (error) {
      this.handleError(error, res, next);
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      
      const result = await authService.forgotPassword(email);
      
      res.json({
        success: true,
        data: result.resetUrl ? { resetUrl: result.resetUrl } : undefined,
        message: 'If an account exists, a password reset link will be sent'
      });
    } catch (error) {
      this.handleError(error, res, next);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(req, res, next) {
    try {
      const { email, token, newPassword } = req.body;
      
      await authService.resetPassword(email, token, newPassword);
      
      res.json({
        success: true,
        message: 'Password reset successfully. Please login with your new password.'
      });
    } catch (error) {
      this.handleError(error, res, next);
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.query;
      
      await authService.verifyEmail(token);
      
      res.json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      this.handleError(error, res, next);
    }
  }

  /**
   * Resend verification email
   */
  async resendVerification(req, res, next) {
    try {
      const { email } = req.body;
      
      await authService.resendVerificationEmail(email);
      
      res.json({
        success: true,
        message: 'Verification email sent'
      });
    } catch (error) {
      this.handleError(error, res, next);
    }
  }

  /**
   * Handle errors - Convert service errors to HTTP responses
   */
  handleError(error, res, next) {
    const errorMap = {
      'USER_ALREADY_EXISTS': { status: 409, message: 'User with this email already exists' },
      'INVALID_CREDENTIALS': { status: 401, message: 'Invalid email or password' },
      'ACCOUNT_INACTIVE': { status: 401, message: 'Your account has been deactivated' },
      'NO_REFRESH_TOKEN': { status: 401, message: 'No refresh token provided' },
      'INVALID_REFRESH_TOKEN': { status: 401, message: 'Invalid or expired refresh token' },
      'USER_NOT_FOUND': { status: 404, message: 'User not found' },
      'INVALID_CURRENT_PASSWORD': { status: 400, message: 'Current password is incorrect' },
      'PASSWORD_SAME_AS_OLD': { status: 400, message: 'New password must be different from current password' },
      'INVALID_RESET_TOKEN': { status: 400, message: 'Invalid or expired reset token' },
      'INVALID_VERIFICATION_TOKEN': { status: 400, message: 'Invalid or expired verification token' },
      'EMAIL_ALREADY_VERIFIED': { status: 400, message: 'Email already verified' },
      'EMAIL_REQUIRED': { status: 400, message: 'Email is required' },
      'INVALID_EMAIL': { status: 400, message: 'Please provide a valid email address' },
      'PASSWORD_REQUIRED': { status: 400, message: 'Password is required' },
      'PASSWORD_TOO_SHORT': { status: 400, message: 'Password must be at least 6 characters' },
      'NAME_REQUIRED': { status: 400, message: 'Name is required' },
      'NAME_TOO_SHORT': { status: 400, message: 'Name must be at least 2 characters' },
      'NAME_TOO_LONG': { status: 400, message: 'Name must be less than 100 characters' }
    };
    
    const mapped = errorMap[error.message];
    
    if (mapped) {
      res.status(mapped.status).json({
        success: false,
        error: {
          code: error.message,
          message: mapped.message
        }
      });
    } else {
      // Pass to global error handler
      next(error);
    }
  }
}

module.exports = new AuthController();