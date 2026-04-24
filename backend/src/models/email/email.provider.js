const nodemailer = require('nodemailer');

class EmailProvider {
    constructor() {
        this.transporter = null;
        this.isInitialized = false;
    }
    /**
     * Initialize email provider based on environment
     */

    async initialize() {
        const provider = process.env.EMAIL_PROVIDER || 'smtp';

        try {
            switch (provider) {
                case 'smtp':
                    this.transporter = nodemailer.createTransport({
                        host: process.env.SMTP_HOST || 'smtp.gmail.com',
                        port: parseInt(process.env.SMTP_PORT) || 587,
                        secure: process.env.SMTP_SECURE === 'true',
                        auth: {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASS
                        },
                        pool: true,
                        maxConnections: 5,
                        rateLimit: 10
                    });
                    break;
                case 'sendgrid':
                    const sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    this.transporter = sgMail;
                    break;

                case 'ses':
                    const aws = require('@aws-sdk/client-ses');
                    const { defaultProvider } = require('@aws-sdk/credential-provider-node');
                    const ses = new aws.SES({
                        region: process.env.AWS_REGION,
                        credentialDefaultProvider: defaultProvider
                    });
                    this.transporter = nodemailer.createTransport({ SES: { ses, aws } });
                    break;

                default:
                    throw new Error(`Unknown email provider: ${provider}`);
            }

            // Verify connection for SMTP
            if (provider === 'smtp') {
                await this.transporter.verify();
            }
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('Failed to initialize email provider:', error);
            this.isInitialized = false;
            return false;
        }

        /**
 * Send email through configured provider
 */
    }
    async send(options) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        // If email is disabled, just log
        if (process.env.ENABLE_EMAIL !== 'true') {
            console.log('📧 Email would be sent (disabled):', {
                to: options.to,
                subject: options.subject
            });
            return { success: true, mock: true };
        }

        try {
            let result;
            const provider = process.env.EMAIL_PROVIDER || 'smtp';

            const mailOptions = {
                from: options.from || process.env.EMAIL_FROM || 'noreply@ims-system.com',
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
                cc: options.cc,
                bcc: options.bcc,
                attachments: options.attachments
            };

            if (provider === 'sendgrid') {
                result = await this.transporter.send(mailOptions);
            } else {
                result = await this.transporter.sendMail(mailOptions);
            }

            console.log(`📧 Email sent successfully to: ${options.to}`);

            return {
                success: true,
                messageId: result.messageId || result[0]?.headers['x-message-id'],
                provider
            };

        } catch (error) {
            console.error('❌ Failed to send email:', error);
            throw new Error(`Email send failed: ${error.message}`);
        }
    }

    /**
     * Send bulk emails
     */
    async sendBulk(emails) {
        const results = [];

        for (const email of emails) {
            try {
                const result = await this.send(email);
                results.push({ success: true, email: email.to, result });
            } catch (error) {
                results.push({ success: false, email: email.to, error: error.message });
            }

            // Small delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return results;
    }





}

module.exports = new EmailProvider();
