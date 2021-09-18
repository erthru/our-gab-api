import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export enum AuthDocument {
    schemaName = "auth",
    username = "username",
    password = "password",
    level = "level",
}

export enum AuthLevel {
    ADMIN = "ADMIN",
    PEOPLE = "PEOPLE",
}

export interface IAuth extends Document {
    [AuthDocument.username]?: string;
    [AuthDocument.password]?: string;
    [AuthDocument.level]?: AuthLevel;
}

const schema = new Schema(
    {
        _id: {
            type: String,
            default: uuidV4,
        },

        [AuthDocument.username]: {
            type: String,
            required: true,
            unique: true,
        },

        [AuthDocument.password]: {
            type: String,
            required: true,
        },

        [AuthDocument.level]: {
            type: AuthLevel,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IAuth>(AuthDocument.schemaName, schema);
