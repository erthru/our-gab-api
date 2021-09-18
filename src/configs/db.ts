import mongoose, { ConnectionOptions } from "mongoose";
import { DB_URL } from "../helpers/environments";

const db = async () => {
    const options: ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true,
    };

    return await mongoose.connect(DB_URL, options);
};

export default db;
