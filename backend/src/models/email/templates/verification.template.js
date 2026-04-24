class VerificationTemplate {
    static getSubject() {
        return '✓ Verify Your Email Address';
    }

    static getHtml(data) {
        const { name, verifyUrl, year = new Date().getFullYear() } = data;

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Email</title>
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
            background: #10b981;
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
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: 600;
          }
          .button:hover {
            background: #059669;
          }
          .info {
            background: #d1fae5;
            padding: 15px;
            border-radius: 8px;
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
            <h1>✓ Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Please verify your email address to activate your IMS account and access all features.</p>
            
            <div class="info">
              <strong>✨ Benefits of verification:</strong>
              <ul>
                <li>Full access to all features</li>
                <li>Receive important notifications</li>
                <li>Password recovery capability</li>
                <li>Enhanced account security</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${verifyUrl}" class="button">
                Verify Email Address →
              </a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p><code style="background: #1f2937; color: #10b981; padding: 10px; display: block; border-radius: 5px; word-break: break-all;">${verifyUrl}</code></p>
            
            <p>This verification link will expire in <strong>24 hours</strong>.</p>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <p>Best regards,<br><strong>The IMS Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${year} Inventory Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }

    static getText(data) {
        const { name, verifyUrl } = data;

        return `
      Verify Your Email Address
      
      Hello ${name},
      
      Please verify your email address to activate your IMS account and access all features.
      
      Benefits of verification:
      - Full access to all features
      - Receive important notifications
      - Password recovery capability
      - Enhanced account security
      
      Verify your email: ${verifyUrl}
      
      This verification link will expire in 24 hours.
      
      If you didn't create an account with us, please ignore this email.
      
      Best regards,
      The IMS Team
      
      © ${new Date().getFullYear()} Inventory Management System. All rights reserved.
    `;
    }
}

module.exports = VerificationTemplate;