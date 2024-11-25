import { PrismaClient, LogLevel as PrismaLogLevel } from "@prisma/client";
import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogLevel } from "../../domain/entities/log.entity";

const prisma = new PrismaClient();

const severityEnum ={
    low: PrismaLogLevel.LOW,
    medium: PrismaLogLevel.MEDIUM,
    high: PrismaLogLevel.HIGH,
}

export class PostgresLogDataSource implements LogDataSource {
    async saveLogs(log: LogEntity): Promise<void> {
        const { createdAt, level, message, origin } = log;
        const levelEnum = severityEnum[level];
        const newLog = await prisma.logModel.create({
            data: {
                createdAt,
                level: levelEnum,
                message,
                origin,
            }
        });
        console.log('Saved on Postgres'+newLog);
    }

    async getLogs(logLevel: LogLevel): Promise<LogEntity[]> {
        const levelEnum= severityEnum[logLevel];
        const dbLogs = await prisma.logModel.findMany({
            where: {
                level: levelEnum,
            },
        });
        return dbLogs.map(LogEntity.fromObject);
    }
    
}   