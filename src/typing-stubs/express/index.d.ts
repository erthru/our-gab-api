import "express";
import { TokenVerified } from "../../middlewares/verify-token";
import { Server } from "socket.io";

declare global {
    namespace Express {
        interface Request {
            tokenVerified: TokenVerified;
            webSocket: Server;
        }
    }
}
