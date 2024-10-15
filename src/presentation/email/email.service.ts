import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachment[];
}

interface Attachment {
    filename: string;
    path: string;
}

export class EmailService {
    private transporter = nodemailer.createTransport({
        service: envs.MaILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY,
        },
    });

    async sendEmail(options: SendEmailOptions): Promise<boolean> {
        const { to, subject, htmlBody, attachments = [] } = options;
        try {
            const sentInformation = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachments,
            });
            console.log(sentInformation);
            return true;
        } catch (error) {
            return false;
        }    
    }

    async sendEmailWithFileSystemLogs(to: string | string[]) {
        const subject = 'Logs from server';
        const htmlBody = `
            <h2> Hello! </h2>
            <h3> This is a test email with logs </h3>
            <p> Logs on this email are from the server </p>
        `;
        const attachments: Attachment[] = [
            { filename: 'logs-low.log', path: './logs/logs-low.log' },
            { filename: 'logs-medium.log', path: './logs/logs-medium.log' },
            {filename : 'logs-high.log', path : './logs/logs-high.log'},
        ];

        return this.sendEmail({ to, subject, htmlBody, attachments });
    }

}
