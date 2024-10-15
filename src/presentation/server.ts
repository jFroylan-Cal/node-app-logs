import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasources";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

const fileSystemDataSource = new LogRepositoryImpl(new FileSystemDataSource());


export class Server {
    public static start() { 
        console.log("Server started!");

        //## Send an email

        // const emailService = new EmailService();
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
        
        const url = "http://localhost:3000/";
        CronService.CreateJob( "*/10 * * * * *", () => {
            new CheckService(() => console.log(`${url} is ok!`),
            ( error ) => console.log(error), fileSystemDataSource).execute(url);
            // new CheckService().execute("http://localhost:3000/");
        });
        
    }
}
