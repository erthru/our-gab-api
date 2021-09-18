import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export enum ChannelDocument {
    schemaName = "channel",
    peopleIds = "peopleIds",
}

export interface IChannel extends Document {
    [ChannelDocument.peopleIds]?: string[];
}

const schema = new Schema(
    {
        _id: {
            type: String,
            default: uuidV4,
        },

        [ChannelDocument.peopleIds]: {
            type: [String],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IChannel>(ChannelDocument.schemaName, schema);
