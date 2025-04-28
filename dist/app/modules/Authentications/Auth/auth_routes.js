"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const user_validation_1 = require("../User/user_validation");
const auth_controller_1 = require("./auth_controller");
const user_controller_1 = require("../User/user_controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const admin_controller_1 = require("../Admin/admin_controller");
const multer_config_1 = require("../../../config/multer.config");
const user_interface_1 = require("../User/user_interface");
const router = (0, express_1.Router)();
router.post('/login', (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), auth_controller_1.AuthController.loginUser);
router.post('/register', multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), user_controller_1.UserController.registerUser);
router.post('/refresh-token', auth_controller_1.AuthController.refreshToken);
router.patch('/users/:id/block', (0, auth_1.default)(user_interface_1.UserRole.Admin), admin_controller_1.AdminController.updateUserBlocked);
exports.AuthRoutes = router;
