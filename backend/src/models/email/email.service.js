const emailProvider = require('./email.provider');
const emailQueue = require('./email.queue');
const WelcomeTemplate = require('./templates/welcome.template');
const ResetPasswordTemplate = require('./templates/resetPassword.template');
const VerificationTemplate = require('./templates/verification.template');
const StockAlertTemplate = require('./templates/stockAlert.template');
// const DailySummaryTemplate = require('./templates/dailySummary.template');
class EmailService {
    constructor() {
        this.useQueue = process.env.EMAIL_USE_QUEUE !== 'false';
        this.provider = emailProvider;
        this.queue = emailQueue;
    }
    /**
  * Send email with optional queuing
  */
    async send(options, priority = 'normal') {
        if (this.useQueue) {
            return await this.queue.add(options, priority);
        }
        return await this.provider.send(options);
    }
    /**
  * Send welcome email to new user
  */

    async sendWelcomeEmail(to, name, companyName = "IMS") {
        const subject = WelcomeTemplate.getSubject();
        const html = WelcomeTemplate.getHtml({ name, companyName });
        const text = WelcomeTemplate.getText({ name, companyName });

        return this.send({
            to,
            subject,
            html,
            text
        }, 'high');
    }
    /**
  * Send password reset email
  */
    async sendPasswordResetEmail(to, name, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const subject = ResetPasswordTemplate.getSubject();
        const html = ResetPasswordTemplate.getHtml({ name, resetUrl });
        const text = ResetPasswordTemplate.getText({ name, resetUrl });

        return await this.send({
            to,
            subject,
            html,
            text
        }, 'high');
    }
    /**
  * Send email verification email
  */
    async sentVerificationEmail(to, name, verifyUrl) {
        const subject = VerificationTemplate.getSubject();
        const html = VerificationTemplate.getHtml({ name, verifyUrl });
        const text = VerificationTemplate.getText({ name, verifyUrl });

        return await this.send({
            to,
            subject,
            html,
            text
        }, 'high');
    }

    /**
     * Send stock alert email
     */
    async sendStockAlertEmail(to, data) {
        const subject = StockAlertTemplate.getSubject(data.productName);
        const html = StockAlertTemplate.getHtml(data);
        const text = StockAlertTemplate.getText(data);

        return await this.send({
            to,
            subject,
            html,
            text
        }, 'high');
    }

}

module.exports = new EmailService();