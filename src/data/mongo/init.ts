
import mongoose from "mongoose";

interface ConnectOptions { 
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase { 
    static async connect(options: ConnectOptions) {   
        const { mongoUrl, dbName } = options;
        try {
            await mongoose.connect(mongoUrl, { dbName: dbName });
            console.log(`MongoDB connected to ${mongoUrl}`);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
