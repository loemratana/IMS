class ResetPasswordTemplate {
    static getSubject() {
        return '🔐 Password Reset Request';
    }

    static getHtml(data) {
        const { name, resetUrl, expiresIn = '1 hour', year = new Date().getFullYear() } = data;

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: #ef4444;
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
            background: #f9fafb;
          }
          .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #ef4444;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: 600;
          }
          .button:hover {
            background: #dc2626;
          }
          .code-block {
            background: #1f2937;
            color: #10b981;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            word-break: break-all;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>We received a request to reset your password for your IMS account.</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This link will expire in <strong>${expiresIn}</strong>
            </div>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">
                Reset Password →
              </a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <div class="code-block">
              ${resetUrl}
            </div>
            
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <hr>
            <p><small>For security reasons, this link will expire after ${expiresIn}. If you need to reset your password after that, please request a new reset link.</small></p>
            
            <p>Best regards,<br><strong>The IMS Security Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${year} Inventory Management System. All rights reserved.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }

    static getText(data) {
        const { name, resetUrl, expiresIn = '1 hour' } = data;

        return `
      Password Reset Request
      
      Hello ${name},
      
      We received a request to reset your password for your IMS account.
      
      ⚠️ Security Notice: This link will expire in ${expiresIn}
      
      Reset your password: ${resetUrl}
      
      If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
      
      For security reasons, this link will expire after ${expiresIn}.
      
      Best regards,
      The IMS Security Team
      
      © ${new Date().getFullYear()} Inventory Management System. All rights reserved.
    `;
    }
}

module.exports = ResetPasswordTemplate;