import { Router } from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "./user_interface";
import { UserController } from "./user_controller";
import validateRequest from "../../../middlewares/validateRequest";
import { UserValidation } from "./user_validation";
import { multerUpload } from "../../../config/multer.config";
import { parseBody } from "../../../middlewares/bodyParser";


const router = Router();


router.get('/', UserController.getAllUser);

router.get('/profile', auth(UserRole.Student), UserController.myProfile);

router.patch('/update-profile', auth(UserRole.Student), multerUpload.single('profilePhoto'), parseBody, validateRequest(UserValidation.studentInfoValidationSchema), UserController.updateProfile);

router.patch('/:id/status', auth(UserRole.Admin), UserController.updateUserStatus);

export const UserRoutes = router;