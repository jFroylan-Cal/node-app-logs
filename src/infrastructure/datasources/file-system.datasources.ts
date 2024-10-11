import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogLevel } from "../../domain/entities/log.entity";
import fs from 'fs';


export class FileSystemDataSource implements LogDataSource {

    private readonly _logsPath = 'logs/';
    private readonly _allLogsPath = 'logs/logs-low.log';
    private readonly _mediumLogsPath = 'logs/logs-medium.log';
    private readonly _highLogsPath = 'logs/logs-high.log';

    constructor() { 
        this.createLogFile();
    }

    private createLogFile = () => { 
        if (!fs.existsSync(this._logsPath)) {
            fs.mkdirSync(this._logsPath);
        }

        [
            this._allLogsPath,
            this._mediumLogsPath,
            this._highLogsPath
        ].forEach(filePath => {
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '');
            }
        });
    }

    async saveLogs(log: LogEntity): Promise<void> {
        
        const logAsJson = `${JSON.stringify(log)}\n`;
        
        fs.appendFileSync(this._allLogsPath, `${JSON.stringify(log)}\n`);
        
        if (log.level === LogLevel.low) return;
        if (log.level === LogLevel.medium) {
            fs.appendFileSync(this._mediumLogsPath, logAsJson);
        } else {
            fs.appendFileSync(this._highLogsPath, logAsJson);
        }
    
    }

    private getLogsFromFile = ( path : string): LogEntity[] => {
        const content = fs.readFileSync(path, 'utf8');
        const logs = content.split('\n').map(log => LogEntity.fromJson(log));
        return logs;
    } 

    async getLogs(logLevel: LogLevel): Promise<LogEntity[]> {
        switch (logLevel) {
        case LogLevel.low:
            return  this.getLogsFromFile(this._allLogsPath);
            
        case LogLevel.medium:
            return this.getLogsFromFile(this._mediumLogsPath);
            
        case LogLevel.high:
            return this.getLogsFromFile(this._highLogsPath);

        default:
            throw new Error(`Log level ${logLevel} not implemented`);
        }
    } 

}

