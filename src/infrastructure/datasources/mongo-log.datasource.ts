import { LogModel } from "../../data/mongo/models/log.model";
import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogLevel } from "../../domain/entities/log.entity";

export class MongoLogDataSource implements LogDataSource {

    async saveLogs(log: LogEntity): Promise<void> {
        const newLog = await LogModel.create(log);
        console.log(newLog);
    }
    async getLogs(logLevel: LogLevel): Promise<LogEntity[]> {
        const logs = await LogModel.find({ level: logLevel });
        return logs.map(mongLog => LogEntity.fromObject(mongLog));
    }
    
}