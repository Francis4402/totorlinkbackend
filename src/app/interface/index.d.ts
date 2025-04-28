import { TUser } from "../modules/Authentications/User/user_interface";



declare global {
    namespace Express {
        interface Request {
            user: TUser;
        }
    }
}