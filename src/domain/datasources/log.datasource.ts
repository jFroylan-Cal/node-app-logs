import { LogEntity, LogLevel } from "../entities/log.entity";

export abstract class LogDataSource {
    abstract saveLogs(log: LogEntity): Promise<void>;
    abstract getLogs(logLevel : LogLevel): Promise<LogEntity[]>;
}



