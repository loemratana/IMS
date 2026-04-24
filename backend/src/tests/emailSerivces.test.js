const emailService = require('../models/email/email.service');
const WelcomeTemplate = require('../models/email/templates/welcome.template');

jest.mock('../models/email/templates/welcome.template');

describe('EmailService - sendWelcomeEmail', () => {

    beforeEach(() => {
        // ✅ DO NOT redeclare emailService

        emailService.send = jest.fn().mockResolvedValue('EMAIL_SENT');

        WelcomeTemplate.getSubject.mockReturnValue('Welcome!');
        WelcomeTemplate.getHtml.mockReturnValue('<h1>Hello</h1>');
        WelcomeTemplate.getText.mockReturnValue('Hello');
    });

    it('should send welcome email with correct data', async () => {
        const result = await emailService.sendWelcomeEmail(
            'loemratana63@gmail.com',
            'Ratana',
            'MyCompany'
        );

        expect(WelcomeTemplate.getSubject).toHaveBeenCalled();

        expect(WelcomeTemplate.getHtml).toHaveBeenCalledWith({
            name: 'Ratana',
            companyName: 'MyCompany'
        });

        expect(WelcomeTemplate.getText).toHaveBeenCalledWith({
            name: 'Ratana',
            companyName: 'MyCompany'
        });

        expect(emailService.send).toHaveBeenCalledWith(
            {
                to: 'loemratana63@gmail.com',
                subject: 'Welcome!',
                html: '<h1>Hello</h1>',
                text: 'Hello'
            },
            'high'
        );

        expect(result).toBe('EMAIL_SENT');
    });
});