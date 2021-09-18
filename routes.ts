import { Router } from "express";
import * as v1AuthController from "./controllers/auth/v1";
import * as v1PeopleController from "./controllers/people/v1";
import verifyToken from "./middlewares/verify-token";
import uploader, { UploadType } from "./middlewares/uploader";
import { PeopleDocument } from "./models/people";

const router = Router();

router.post("/v1/auth/login", v1AuthController.login);
router.post("/v1/auth/refresh", verifyToken.verifyForRefresh, v1AuthController.refresh);

router.get("/v1/people/me", verifyToken.verify, v1PeopleController.me);
router.get("/v1/people/me/channels", verifyToken.verify, v1PeopleController.myChannels);
router.get("/v1/people/me/channel/:channelId/messages", verifyToken.verify, v1PeopleController.myMessagesByChannelId);
router.get("/v1/people/me/channel/:channelId/messages", verifyToken.verify, v1PeopleController.myMessagesByChannelId);
router.get("/v1/people/search/:username", verifyToken.verify, v1PeopleController.searchByUsername);
router.get("/v1/people/search/:username", verifyToken.verify, v1PeopleController.searchByUsername);
router.post("/v1/people", v1PeopleController.add);
router.post("/v1/people/me/message", verifyToken.verify, v1PeopleController.sendMessage);
router.put("/v1/people/me/channel/:channelId", verifyToken.verify, v1PeopleController.readMessages);
router.put("/v1/people/me", verifyToken.verify, v1PeopleController.update);
router.put("/v1/people/me/password", verifyToken.verify, v1PeopleController.updatePassword);
router.put("/v1/people/me/avatar", verifyToken.verify, uploader(UploadType.avatar).single(PeopleDocument.avatar), v1PeopleController.updateAvatar);

export default router;
