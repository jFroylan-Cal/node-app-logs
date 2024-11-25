import { Server } from "./presentation/server";
import { envs } from "./config/plugins/envs.plugin";
import { MongoDatabase } from "./data/mongo/init";
import { LogModel } from "./data/mongo/models/log.model";
import { PrismaClient } from "@prisma/client";

// function auto-invocated to run the main function
(() => {
    main();
})();

async function main() {
    await MongoDatabase.connect({mongoUrl: envs.MONGO_URL, dbName: envs.MONGO_DB_NAME});
    Server.start();
    // console.log(envs.PORT );
    // console.log(envs.MAILER_EMAIL );
    // console.log(envs.MAILER_SECRET_KEY );
    // console.log(envs.PROD );

    //Create a collection = tables , documents = records
    // const newLog = await LogModel.create({
    //     level: "medium",
    //     message: "Test",
    //     origin: "server",
    // });

    const prisma = new PrismaClient();
    const newLog = await prisma.logModel.create({
        data: {
            level: "HIGH",
            message: "Test message high",
            origin: "App.ts",
        }
    });
    const logs = await prisma.logModel.findMany();
    console.log(logs);
}
