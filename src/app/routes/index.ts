import { Router } from "express";
import { AuthRoutes } from "../modules/Authentications/Auth/auth_routes";
import { UserRoutes } from "../modules/Authentications/User/user_routes";


const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/users',
        route: UserRoutes
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;