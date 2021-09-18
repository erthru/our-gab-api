import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../helpers/environments";
import { VERIFY_TOKEN_FAILED } from "../helpers/json";

export type TokenVerified = {
    id: string;
    isRefreshToken: boolean;
};

const verify = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization!!.split(" ")[1];
        const tokenVerified = jwt.verify(token, TOKEN_SECRET) as TokenVerified;

        if (tokenVerified.isRefreshToken) VERIFY_TOKEN_FAILED(res);
        else {
            req.tokenVerified = tokenVerified;
            next();
        }
    } catch (e: any) {
        VERIFY_TOKEN_FAILED(res);
    }
};

const verifyForRefresh = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization!!.split(" ")[1];
        const tokenVerified = jwt.verify(token, TOKEN_SECRET) as TokenVerified;

        if (!tokenVerified.isRefreshToken) VERIFY_TOKEN_FAILED(res);
        else {
            req.tokenVerified = tokenVerified;
            next();
        }
    } catch (e: any) {
        VERIFY_TOKEN_FAILED(res);
    }
};

export default {
    verify: verify,
    verifyForRefresh: verifyForRefresh,
};
