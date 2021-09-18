import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../helpers/environments";

export type TokenVerified = {
    id: string;
    isRefreshToken: boolean;
};

const verify = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization!!.split(" ")[1];
        const tokenVerified = jwt.verify(token, TOKEN_SECRET) as TokenVerified;

        if (tokenVerified.isRefreshToken)
            res.status(401).json({
                isError: true,
                description: "invalid token / expired",
            });
        else {
            req.tokenVerified = tokenVerified;
            next();
        }
    } catch (e: any) {
        res.status(401).json({
            isError: true,
            description: "invalid token / expired",
        });
    }
};

const verifyForRefresh = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization!!.split(" ")[1];
        const tokenVerified = jwt.verify(token, TOKEN_SECRET) as TokenVerified;

        if (!tokenVerified.isRefreshToken)
            res.status(401).json({
                isError: true,
                description: "invalid token / expired",
            });
        else {
            req.tokenVerified = tokenVerified;
            next();
        }
    } catch (e: any) {
        res.status(401).json({
            isError: true,
            description: "invalid token / expired",
        });
    }
};

export default {
    verify: verify,
    verifyForRefresh: verifyForRefresh,
};
