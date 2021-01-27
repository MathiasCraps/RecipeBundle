import { NextFunction, Request, Response } from "express";
import { SessionData } from "../model/SessionData";

export function verifyLoggedIn(request: Request, response: Response, next: NextFunction) {
    const session = request.session as SessionData;

    if (session.loggedIn) {
        return next();
    }

    response.json({error: 'Not logged in'});
}