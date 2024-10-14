import { LogEntity, LogLevel,  } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";


interface CheckServiceUseCase {
    execute( url: string ): Promise<boolean>;
}

type SuccessCallback = () => void | undefined;
type ErrorCallback = ((error: string) => void) | undefined;


export class CheckService implements CheckServiceUseCase {
    
    constructor(
        private readonly _successCallback: SuccessCallback,
        private readonly _errorCallback: ErrorCallback,
        private readonly _logRepository: LogRepository,
    ) { }

    async execute(url: string): Promise<boolean> {
        try {
            const request = await fetch(url);
            if (!request.ok) {
                throw new Error(`Error on check service ${url}`);
            }
            const log = new LogEntity({ level: LogLevel.low, message: `Service ${url} is working`, origin: `check-service.ts` });
            this._logRepository.saveLogs(log);
            this._successCallback && this._successCallback();
            return true;
        } catch (error) {
            const errorMessage = `${error}`;
            const log = new LogEntity({ level: LogLevel.high, message: `Service ${url} is not working`, origin: `check-service.ts` });
            this._logRepository.saveLogs(log);
            this._errorCallback && this._errorCallback(`${error}`);
            return false;
        }
    }

}   