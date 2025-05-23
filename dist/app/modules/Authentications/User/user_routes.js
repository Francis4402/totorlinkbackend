"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const user_interface_1 = require("./user_interface");
const user_controller_1 = require("./user_controller");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const user_validation_1 = require("./user_validation");
const multer_config_1 = require("../../../config/multer.config");
const bodyParser_1 = require("../../../middlewares/bodyParser");
const router = (0, express_1.Router)();
router.get('/', user_controller_1.UserController.getAllUser);
router.get('/profile', (0, auth_1.default)(user_interface_1.UserRole.Student), user_controller_1.UserController.myProfile);
router.patch('/update-profile', (0, auth_1.default)(user_interface_1.UserRole.Student), multer_config_1.multerUpload.single('profilePhoto'), bodyParser_1.parseBody, (0, validateRequest_1.default)(user_validation_1.UserValidation.studentInfoValidationSchema), user_controller_1.UserController.updateProfile);
router.patch('/:id/status', (0, auth_1.default)(user_interface_1.UserRole.Admin), user_controller_1.UserController.updateUserStatus);
exports.UserRoutes = router;
