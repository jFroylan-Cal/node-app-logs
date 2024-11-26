import { CheckService } from "../domain/use-cases/checks/check-service";
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple";
import { SendLogsEmail } from "../domain/use-cases/email/send-email-logs";
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasources";
import { MongoLogDataSource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgresLogDataSource } from "../infrastructure/datasources/postgres-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

const fsLogRepository = new LogRepositoryImpl(
    new FileSystemDataSource()
);
const mongoLogRepository = new LogRepositoryImpl(
    new MongoLogDataSource()
);
const postgresLogRepository = new LogRepositoryImpl(
    new PostgresLogDataSource()
);

const emailService = new EmailService();

export class Server {
    public static start() { 
        console.log("Server started!");
        // new SendLogsEmail(emailService,fileSystemDataSource).execute(['someemail@somemail.com']);
        //## Send an email

        // const emailService = new EmailService(fileSystemDataSource);
        // emailService.sendEmail({
        //     to: "somemail@somemail.com",
        //     subject: "Test email",
        //     htmlBody: `<h2> Hello! </h2>
        //     <p> This is a test email </p>
        //     `,
        // })

        //## Send an email with logs attached
        
        // const emailService = new EmailService();
        // emailService.sendEmailWithFileSystemLogs("someemail@somemail.com");


        //## Cron to check if the server is ok
        
        const url = "http://google.com";
        CronService.CreateJob("*/10 * * * * *", () => {
            new CheckServiceMultiple(
                [fsLogRepository, mongoLogRepository, postgresLogRepository],
                () => console.log(`${url} is ok!`),
                (error: any) => console.log(error)).execute(url);
            // new CheckService().execute("http://localhost:3000/");
        });
        
    }
}
 