import { LogRepositoryImpl } from "../../../infrastructure/repositories/log.repository.impl";
import { EmailService } from "../../../presentation/email/email.service";
import { LogEntity, LogLevel } from "../../entities/log.entity";

interface SendLogsEmailUseCase {
    execute: (to: string | string[]) => Promise<boolean>;
}
export class SendLogsEmail implements SendLogsEmailUseCase {
    constructor( private readonly emailService: EmailService, private readonly logRepository: LogRepositoryImpl) {}
    async execute(to: string | string[]) {
            try {
                const sent = await this.emailService.sendEmailWithFileSystemLogs(to);
                if (!sent) {
                    throw new Error("Error sending email");
                }
                const log = new LogEntity({ level: LogLevel.low, message: `Email sent`, origin: `send-email-logs.ts` });
                this.logRepository.saveLogs(log);
                return true;
            } catch (error) {
                const  log = new LogEntity({ level: LogLevel.high, message: `Error sending email to ${to}`, origin: `send-email-logs.ts` });
                await this.logRepository.saveLogs(log);
                return false;
            }
        }
}