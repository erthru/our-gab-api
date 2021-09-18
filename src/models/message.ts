import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { PeopleDocument } from "./people";
import { ChannelDocument } from "./channel";

export enum MessageDocument {
    schemaName = "message",
    body = "body",
    isRead = "isRead",
    peopleSenderId = "peopleSenderId",
    channelId = "channelId",
}

export interface IMessage extends Document {
    [MessageDocument.body]?: string;
    [MessageDocument.isRead]?: boolean;
    [MessageDocument.peopleSenderId]?: string;
    [MessageDocument.channelId]?: string;
}

const schema = new Schema(
    {
        _id: {
            type: String,
            default: uuidV4,
        },

        [MessageDocument.body]: {
            type: String,
            required: true,
        },

        [MessageDocument.isRead]: {
            type: Boolean,
            required: true,
        },

        [MessageDocument.peopleSenderId]: {
            type: String,
            required: true,
        },

        [MessageDocument.peopleSenderId]: {
            type: String,
            required: true,
        },

        [MessageDocument.channelId]: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

schema.virtual("peopleSender", {
    ref: PeopleDocument.schemaName,
    localField: MessageDocument.peopleSenderId,
    foreignField: "_id",
    justOne: true,
});

schema.virtual(ChannelDocument.schemaName, {
    ref: ChannelDocument.schemaName,
    localField: MessageDocument.channelId,
    foreignField: "_id",
    justOne: true,
});

schema.set("toJSON", {
    transform: (_: any, ret: any, __: any) => {
        delete ret.id;
        return ret;
    },

    virtuals: true,
});

export default mongoose.model<IMessage>(MessageDocument.schemaName, schema);
