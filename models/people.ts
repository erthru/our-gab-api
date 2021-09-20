import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { BASE_URL } from "../helpers/environments";

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

schema.set("toJSON", {
    transform: (_: any, ret: any, __: any) => {
        ret[PeopleDocument.avatar] = `${BASE_URL}uploads/${ret[PeopleDocument.avatar]}`;
        return ret;
    },

    virtuals: true,
});

export default mongoose.model<IPeople>(PeopleDocument.schemaName, schema);
