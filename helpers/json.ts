import { Response } from "express";

export const OK = (res: Response, data: any) => {
    res.status(200).json({
        isError: false,
        description: "ok",
        ...data,
    });
};

export const LOGIN_SUCCESS = (res: Response, data: any) => {
    res.status(200).json({
        isError: false,
        description: "login success",
        ...data,
    });
};

export const TOKEN_REFRESHED = (res: Response, data: any) => {
    res.status(200).json({
        isError: false,
        description: "token refreshed",
        ...data,
    });
};

export const CREATED = (res: Response, data: any) => {
    res.status(201).json({
        isError: false,
        description: "created",
        ...data,
    });
};

export const VERIFY_TOKEN_FAILED = (res: Response) => {
    res.status(401).json({
        isError: true,
        description: "invalid token / expired",
    });
};

export const NO_ACCESS_TO_SOURCE = (res: Response) => {
    res.status(401).json({
        isError: true,
        description: "token have no access to this source",
    });
};

export const LOGIN_FAILED = (res: Response) => {
    res.status(401).json({
        isError: true,
        description: "submitted credentials failed to authenticate",
    });
};

export const ERROR = (res: Response, error: string) => {
    res.status(500).json({
        isError: true,
        description: error,
    });
};
