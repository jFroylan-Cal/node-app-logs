import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasources";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";

const fileSystemDataSource = new LogRepositoryImpl(new FileSystemDataSource());


export class Server {
    public static start() { 
        console.log("Server started!");
        const url = "http://localhost:3000/";

        CronService.CreateJob( "*/10 * * * * *", () => {
            new CheckService(() => console.log(`${url} is ok!`),
            ( error ) => console.log(error), fileSystemDataSource).execute(url);
            // new CheckService().execute("http://localhost:3000/");
        });
        
    }
}
