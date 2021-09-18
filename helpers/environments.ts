import * as dotEnv from "dotenv"

dotEnv.config();

export const PORT = parseInt((process.env.PORT as unknown) as string);
export const BASE_URL = (process.env.BASE_URL as unknown) as string;
export const DB_URL = (process.env.DB_URL as unknown) as string;
export const TOKEN_SECRET = (process.env.TOKEN_SECRET as unknown) as string;
