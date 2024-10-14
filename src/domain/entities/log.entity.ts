
export enum LogLevel {
    low= "low",
    medium= "medium",
    high= "high",
}

export interface Options {
    level: LogLevel;
    message: string;
    createdAt?: Date;
    origin: string;
}

export class LogEntity { 
    public level: LogLevel;
    public message: string;
    public createdAt: Date;
    public origin: string;
    


    constructor(options: Options) {
        const { level, message, origin, createdAt = new Date() } = options;
        this.level = level;
        this.message = message;
        this.createdAt = createdAt;
        this.origin = origin;
    }
    
    static fromJson = ( json: string): LogEntity => {
        const { message, level, createdAt } = JSON.parse(json);
        if (!level || !message || !createdAt) {
            throw new Error(`Invalid log json ${json}`);
        }
        
        const log = new LogEntity({ message,  level,  createdAt, origin});
        return log;
    }
}
