import mongoose from "mongoose";

type ConnectObject = {
    isConnected?: number
}

const connection: ConnectObject = {}

async function dbConnect(): Promise<void> {

    if (connection.isConnected) {
        console.log("Db Already connected ");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODBURI || "", {});
        connection.isConnected = db.connections[0].readyState
        console.log("Db connected sucessfuly");
    } catch (error) {

        console.log("Database coonection ", error);
        process.exit(1)

    }

}

export default dbConnect;

