import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";

const webSocket = (server: any) => {
    const _webSocket = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    return (req: Request, _: Response, next: NextFunction) => {
        req.webSocket = _webSocket;
        next();
    };
};

export default webSocket;
