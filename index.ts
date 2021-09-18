import express from "express";
import cors from "cors";
import { PORT } from "./helpers/environments";
import db from "./configs/db";
import { createServer } from "http";
import routes from "./routes";
import webSocket from "./middlewares/web-socket";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors());
app.use(webSocket(server), routes);

server.listen(PORT, async () => {
    await db();

    console.log("⚡️[DATABASE]: CONNECTED");
    console.log("⚡️[SERVER]: RUNNING");
    console.log(`⚡️[PORT]: ${PORT}`);
    console.log("⚡️[MESSAGE]: エブリシングOK、頑張ってねー、エルトホルくん。ヽ(o＾▽＾o)ノ");
});
