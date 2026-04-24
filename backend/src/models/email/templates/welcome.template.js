class WelcomeTemplate {
    static getSubject() {
        return 'Welcome to Inventory Management System! 🎉';
    }

    static getHtml(data) {
        const { name, companyName = 'IMS', year = new Date().getFullYear() } = data;

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to IMS</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          .feature-list {
            margin: 20px 0;
            padding-left: 20px;
          }
          .feature-list li {
            margin: 10px 0;
            color: #4b5563;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: 600;
          }
          .button:hover {
            background: #5a67d8;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
          }
          .highlight {
            background: #e0e7ff;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ${companyName}! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for joining the Inventory Management System. We're excited to help you streamline your inventory operations!</p>
            
            <div class="highlight">
              <strong>✨ Getting Started Tips:</strong>
              <ul>
                <li>Complete your profile information</li>
                <li>Add your first product</li>
                <li>Set up low stock alerts</li>
                <li>Invite team members</li>
              </ul>
            </div>
            
            <h3>What you can do with IMS:</h3>
            <ul class="feature-list">
              <li>✓ Track inventory in real-time</li>
              <li>✓ Manage products and categories</li>
              <li>✓ Monitor supplier performance</li>
              <li>✓ Generate detailed reports</li>
              <li>✓ Receive automated low stock alerts</li>
              <li>✓ Multi-user support with roles</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">
                Go to Dashboard →
              </a>
            </div>
            
            <p>Need help? Check out our <a href="${process.env.DOCS_URL || '#'}">documentation</a> or contact our support team.</p>
            
            <p>Best regards,<br><strong>The IMS Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${year} Inventory Management System. All rights reserved.</p>
            <p>You received this email because you registered for an IMS account.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }

    static getText(data) {
        const { name, companyName = 'IMS' } = data;

        return `
      Welcome to ${companyName}!
      
      Hello ${name},
      
      Thank you for joining the Inventory Management System. We're excited to help you streamline your inventory operations!
      
      Getting Started Tips:
      - Complete your profile information
      - Add your first product
      - Set up low stock alerts
      - Invite team members
      
      What you can do with IMS:
      ✓ Track inventory in real-time
      ✓ Manage products and categories
      ✓ Monitor supplier performance
      ✓ Generate detailed reports
      ✓ Receive automated low stock alerts
      ✓ Multi-user support with roles
      
      Get started: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard
      
      Need help? Check out our documentation or contact our support team.
      
      Best regards,
      The IMS Team
      
      © ${new Date().getFullYear()} Inventory Management System. All rights reserved.
    `;
    }
}

module.exports = WelcomeTemplate;