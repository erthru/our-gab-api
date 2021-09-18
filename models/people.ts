import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export enum PeopleDocument {
    schemaName = "people",
    name = "name",
    avatar = "avatar",
    authId = "authId",
}

export interface IPeople extends Document {
    [PeopleDocument.name]?: string;
    [PeopleDocument.avatar]?: string;
    [PeopleDocument.authId]?: string;
}

const schema = new Schema(
    {
        _id: {
            type: String,
            default: uuidV4,
        },

        [PeopleDocument.name]: {
            type: String,
            required: true,
        },

        [PeopleDocument.avatar]: {
            type: String,
            required: true,
        },

        [PeopleDocument.authId]: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IPeople>(PeopleDocument.schemaName, schema);
