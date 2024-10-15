import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity, LogLevel } from '../../domain/entities/log.entity';

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

    constructor( private readonly logRepository: LogRepository  ) {}

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
            const log = new LogEntity({ level: LogLevel.low, message: `Email sent`, origin: `email.service.ts` });
            return true;
        } catch (error) {
            const log = new LogEntity({ level: LogLevel.high, message: `Error sending email to ${to}`, origin: `email.service.ts` });
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
