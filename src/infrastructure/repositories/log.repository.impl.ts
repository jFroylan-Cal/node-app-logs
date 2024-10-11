import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogLevel } from "../../domain/entities/log.entity";
import { LogRepository } from "../../domain/repository/log.repository";

export class LogRepositoryImpl implements LogRepository {
    
    constructor( private readonly _logDataSource: LogDataSource) {}
    
    async saveLogs(log: LogEntity): Promise<void> {
        return this._logDataSource.saveLogs(log);
    }
    
    getLogs(logLevel: LogLevel): Promise<LogEntity[]> {
        return this._logDataSource.getLogs(logLevel);
    }

}