import { Request, Response } from "express";
import auth, { AuthDocument } from "../../models/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../helpers/environments";

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const _auth = await auth.findOne({ [AuthDocument.username]: username });

        if (_auth !== null && (await bcrypt.compare(password, _auth?.password!!))) {
            const token = jwt.sign(
                {
                    id: _auth._id,
                    isRefreshToken: false,
                },
                TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                {
                    id: _auth._id,
                    isRefreshToken: true,
                },
                TOKEN_SECRET,
                { expiresIn: "7d" }
            );

            res.status(200).json({
                isError: false,
                description: "login success",
                username: _auth.username,
                token,
                refreshToken,
            });
        } else {
            res.status(401).json({
                isError: true,
                description: "submitted credentials failed to authenticate",
            });
        }
    } catch (e: any) {
        res.status(500).json({
            isError: true,
            description: e.message,
        });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const _auth = await auth.findById(req.tokenVerified.id);

        const token = jwt.sign(
            {
                id: _auth!!._id,
                isRefreshToken: false,
            },
            TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            {
                id: _auth!!._id,
                isRefreshToken: true,
            },
            TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            isError: false,
            description: "token refreshed",
            username: _auth!!.username,
            token,
            refreshToken,
        });
    } catch (e: any) {
        res.status(500).json({
            isError: true,
            description: e.message,
        });
    }
};
