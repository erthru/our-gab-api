import { Request, Response } from "express";
import auth, { AuthDocument } from "../../models/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../helpers/environments";
import { ERROR, LOGIN_FAILED, LOGIN_SUCCESS, TOKEN_REFRESHED } from "../../helpers/json";

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

            LOGIN_SUCCESS(res, {
                username: _auth.username,
                token,
                refreshToken,
            });
        } else {
            LOGIN_FAILED(res);
        }
    } catch (e: any) {
        ERROR(res, e.message);
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

        TOKEN_REFRESHED(res, {
            username: _auth!!.username,
            token,
            refreshToken,
        });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
