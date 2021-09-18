import { Request, Response } from "express";
import auth, { AuthDocument, AuthLevel } from "../../models/auth";
import people, { PeopleDocument } from "../../models/people";
import bcrypt from "bcrypt";
import channel, { ChannelDocument, IChannel } from "../../models/channel";
import message, { MessageDocument } from "../../models/message";
import fs from "fs";
import path from "path";

export const myChannels = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const skip = (parseInt(req.query.page as string) - 1) * parseInt(req.query.limit as string);

        const _auth = await auth.findById(req.tokenVerified.id);
        const _people = await people.findOne({ [PeopleDocument.authId]: _auth!!._id });

        const channelFilter = {
            [ChannelDocument.peopleIds]: _people!!._id,
        };

        const channels = await channel.find(channelFilter).populate(PeopleDocument.schemaName).sort({ _id: -1 }).skip(skip).limit(limit);
        const channelsTotal = await channel.countDocuments(channelFilter);

        const finalResults = [];

        for (let channel of channels) {
            const _message = await message
                .findOne({ [MessageDocument.channelId]: channel._id })
                .populate("peopleSender")
                .sort({ _id: -1 });

            finalResults.push({
                ...channel.toJSON(),
                message: _message,
            });
        }

        res.status(200).json({
            error: false,
            description: "showing lists of channels loaded",
            channels: finalResults,
            channelsTotal,
        });
    } catch (e: any) {
        res.status(500).json({
            error: true,
            description: e.message,
        });
    }
};

export const searchByUsername = async (req: Request, res: Response) => {
    try {
        const _auth = await auth.findOne({ [AuthDocument.username]: req.params.username });
        const _people = await people.findOne({ [PeopleDocument.authId]: _auth!!._id });

        res.status(200).json({
            error: false,
            description: "showing people by their username",
            people: _people,
            username: _auth!!.username,
        });
    } catch (e: any) {
        res.status(500).json({
            error: true,
            description: e.message,
        });
    }
};

export const myMessagesByChannelId = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const skip = (parseInt(req.query.page as string) - 1) * parseInt(req.query.limit as string);

        const _auth = await auth.findById(req.tokenVerified.id);
        const _people = await people.findOne({ [PeopleDocument.authId]: _auth!!._id });
        const _channel = await channel.findById(req.params.channelId);

        const filterdPeopleIds = _channel!!.peopleIds!!.filter((peopleId) => peopleId !== _people!!.id);
        const peoplePartner = await people.findById(filterdPeopleIds[0]);

        if (_channel!!.peopleIds?.includes(_people!!._id)) {
            const messagesFilter = {
                [MessageDocument.channelId]: req.params.channelId,
            };

            const messages = await message.find(messagesFilter).sort({ _id: -1 }).skip(skip).limit(limit);
            const messagesTotal = await message.countDocuments(messagesFilter);

            res.status(200).json({
                error: false,
                description: "showing lists of messages",
                messages,
                messagesTotal,
                nameOfPartner: peoplePartner!!.name,
            });
        } else {
            res.status(401).json({
                error: true,
                description: "this people have no access to this channel",
            });
        }
    } catch (e: any) {
        res.status(500).json({
            error: true,
            description: e.message,
        });
    }
};

export const me = async (req: Request, res: Response) => {
    try {
        const _auth = await auth.findById(req.tokenVerified.id);
        const _people = await people.findOne({ [PeopleDocument.authId]: _auth!!.id });

        res.status(500).json({
            error: false,
            description: "showing people profile",
            people: _people,
            username: _auth!!.username,
        });
    } catch (e: any) {
        res.status(500).json({
            error: true,
            description: e.message,
        });
    }
};

export const add = async (req: Request, res: Response) => {
    try {
        const { username, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const _auth = await auth.create({
            [AuthDocument.username]: username,
            [AuthDocument.password]: hashedPassword,
            [AuthDocument.level]: AuthLevel.PEOPLE,
        });

        const _people = await people.create({
            [PeopleDocument.name]: name,
            [PeopleDocument.avatar]: "default-avatar.png",
            [PeopleDocument.authId]: _auth._id,
        });

        res.status(201).json({
            error: false,
            description: "people registered",
            people: _people,
            username: _auth.username,
        });
    } catch (e: any) {
        res.status(500).json({
            error: true,
            description: e.message,
        });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { body, peopleReceiverId } = req.body;

        const _auth = await auth.findById(req.tokenVerified.id);
        const _people = await people.findOne({ [PeopleDocument.authId]: _auth!!._id });

        const existingChannel = await channel.findOne({
            [ChannelDocument.peopleIds]: {
                $all: [peopleReceiverId, _people!!._id],
            },
        });

        let channelToUse = null as unknown as IChannel;

        if (existingChannel === null)
            channelToUse = await channel.create({
                [ChannelDocument.peopleIds]: [peopleReceiverId, _people!!._id],
            });
        else channelToUse = existingChannel;

        const _message = await message.create({
            [MessageDocument.body]: body,
            [MessageDocument.isRead]: false,
            [MessageDocument.peopleSenderId]: _people!!._id,
            [MessageDocument.channelId]: channelToUse!!._id,
        });

        res.status(201).json({
            error: false,
            description: "message sent",
            message: _message,
        });
    } catch (e: any) {
        res.status(500).json({
            error: true,
            description: e.message,
        });
    }
};

export const readMessages = async (req: Request, res: Response) => {
    try {
        const _auth = await auth.findById(req.tokenVerified.id);
        const _people = await people.findOne({ [PeopleDocument.authId]: _auth!!._id });
        const _channel = await channel.findById(req.params.channelId);

        if (_channel!!.peopleIds?.includes(_people!!._id)) {
            const filterdPeopleIds = _channel!!.peopleIds!!.filter((peopleId) => peopleId !== _people!!.id);
            const updatedMessages = await message.updateMany(
                {
                    [MessageDocument.channelId]: _channel!!._id,
                    [MessageDocument.peopleSenderId]: filterdPeopleIds[0],
                },
                {
                    [MessageDocument.isRead]: true,
                }
            );

            res.status(200).json({
                error: false,
                description: "messages readed",
                readedTotal: updatedMessages.nModified,
            });
        } else {
            res.status(401).json({
                error: true,
                description: "this people have no access to this channel",
            });
        }
    } catch (e: any) {
        res.status(500).json({
            error: true,
            description: e.message,
        });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const _auth = await auth.findById(req.tokenVerified.id);

        const _people = await people.findOneAndUpdate(
            { [PeopleDocument.authId]: _auth!!._id },
            {
                [PeopleDocument.name]: req.body.name,
            },
            { new: true }
        );

        res.status(200).json({
            error: false,
            description: "profile updated",
            people: _people,
            username: _auth!!.username,
        });
    } catch (e: any) {
        res.status(500).json({
            error: true,
            description: e.message,
        });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const _auth = await auth.findByIdAndUpdate(
            req.tokenVerified.id,
            {
                [AuthDocument.password]: hashedPassword,
            },
            { new: true }
        );

        const _people = await people.findOne({ [PeopleDocument.authId]: _auth!!._id });

        res.status(200).json({
            error: false,
            description: "profile password updated",
            people: _people,
            username: _auth!!.username,
        });
    } catch (e: any) {
        res.status(500).json({
            error: true,
            description: e.message,
        });
    }
};

export const updateAvatar = async (req: Request, res: Response) => {
    try {
        const _auth = await auth.findById(req.tokenVerified.id);
        const oldPeople = await people.findOne({ [PeopleDocument.authId]: _auth!!._id });

        const _people = await people.findOneAndUpdate(
            { [PeopleDocument.authId]: _auth!!._id },
            {
                [PeopleDocument.avatar]: req.file!!.filename,
            },
            { new: true }
        );

        if (oldPeople!!.avatar !== "default-avatar.png") fs.unlinkSync(path.join(`public/uploads/${oldPeople!!.avatar}`));

        res.status(200).json({
            error: false,
            description: "profile avatar updated",
            people: _people,
            username: _auth!!.username,
        });
    } catch (e: any) {
        fs.unlinkSync(path.join(`public/uploads/${req.file!!.filename}`));

        res.status(500).json({
            error: true,
            description: e.message,
        });
    }
};
