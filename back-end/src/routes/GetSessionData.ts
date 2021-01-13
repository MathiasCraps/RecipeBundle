import { Pool } from "pg";
import { requestAccessToken } from "../github-api/GetAccessToken";
import { requestUserApi } from "../github-api/UserApiRequest";
import { UserMailScope } from "../model/github-api/UserMailScope";
import { UserScope } from "../model/github-api/UserScope";
import { SessionData } from "../model/SessionData";
import { createUser } from "../sql/CreateUser";
import { getUser } from "../sql/GetUser";

export async function getSessionData(pool: Pool, session: SessionData, auth: string | undefined): Promise<SessionData> {
    if (session.loggedIn) {
        return session;
    }

    // no auth callback code found. Abort the request
    if (!auth) {
        throw new Error('No auth');
    }

    // in case we do not already have an accessToken, retrieve it
    if (!session.accessToken) {
        try {
            const accessToken = await requestAccessToken(auth as string);
            session.accessToken = accessToken as string;
        } catch (err) {
            throw new Error(err);
        }
    }

    try {
        const baseUserInfo = await requestUserApi(session.accessToken, 'https://api.github.com/user') as UserScope;
        const eMailInfo = await requestUserApi(session.accessToken, 'https://api.github.com/user/emails') as UserMailScope[];
        const mail = eMailInfo.filter((mailInfo) => mailInfo.primary)[0]?.email;
    
        // nothing useful to use, abort
        if (!mail) {
            throw new Error('No mail');
        }
    
        session.userName = baseUserInfo.name || 'GitHub enabled ninja';
        session.email = mail;
        session.loggedIn = true;

        let userId = await getUser(pool, mail);
        if (typeof userId !== 'number') {
            userId = await createUser(pool, baseUserInfo.name, mail)
        }
        session.userId = userId;
        return session;
    } catch (err) {
        throw err;
    }
}