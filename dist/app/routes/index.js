"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/Authentications/Auth/auth_routes");
const user_routes_1 = require("../modules/Authentications/User/user_routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes
    },
    {
        path: '/users',
        route: user_routes_1.UserRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
