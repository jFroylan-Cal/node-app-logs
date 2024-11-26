import { LogEntity, LogLevel,  } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";


interface CheckServiceMultipleUseCase {
    execute( url: string ): Promise<boolean>;
}

type SuccessCallback = () => void | undefined;
type ErrorCallback = ((error: string) => void) | undefined;


export class CheckServiceMultiple implements CheckServiceMultipleUseCase {
    
    constructor(
        private readonly _logRepository: LogRepository[],
        private readonly _successCallback: SuccessCallback,
        private readonly _errorCallback: ErrorCallback,
    ) { }

    private callLogs(log: LogEntity) { 
        this._logRepository.forEach( logRepository => {
            logRepository.saveLogs(log);
        });
    }

    async execute(url: string): Promise<boolean> {
        try {
            const request = await fetch(url);
            if (!request.ok) {
                throw new Error(`Error on check service ${url}`);
            }
            const log = new LogEntity({ level: LogLevel.low, message: `Service ${url} is working`, origin: `check-service.ts` });
            this.callLogs(log);
            this._successCallback && this._successCallback();
            return true;
        } catch (error) {
            const errorMessage = `${error}`;
            const log = new LogEntity({ level: LogLevel.high, message: `Service ${url} is not working, ${errorMessage}`, origin: `check-service.ts` });
            this.callLogs(log);
            this._errorCallback && this._errorCallback(`${error}`);
            return false;
        }
    }

}   