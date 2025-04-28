import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { UserValidation } from "../User/user_validation";
import { AuthController } from "./auth_controller";

import auth from "../../../middlewares/auth";
import { AdminController } from "../Admin/admin_controller";
import { UserRole } from "../User/user_interface";
import { AuthValidation } from "./auth_validation";
import { UserController } from "../User/user_controller";
import clientInfoParser from "../../../middlewares/clientInfoParser";



const router = Router();

router.post('/login', AuthController.loginUser);

router.post('/register', clientInfoParser, UserController.registerUser);

router.post('/refresh-token', validateRequest(AuthValidation.refreshTokenZodSchema), AuthController.refreshToken);

router.post('/change-password', auth(UserRole.Admin, UserRole.Student, UserRole.Tutor), AuthController.resetPassword);

router.post('/forgot-password', AuthController.forgotPassword);

router.patch('/users/:id/block', auth(UserRole.Admin), AdminController.updateUserBlocked);

export const AuthRoutes = router;
