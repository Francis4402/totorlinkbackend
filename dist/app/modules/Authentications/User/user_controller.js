"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const user_services_1 = require("./user_services");
const config_1 = __importDefault(require("../../../config"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_services_1.UserServices.registerUser(req.body);
        const { refreshToken, accessToken } = result;
        res.cookie('refreshToken', refreshToken, {
            secure: config_1.default.node_env === 'production',
            httpOnly: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 365,
        });
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'User registration completed successfully!',
            data: {
                accessToken,
            },
        });
    }
    catch (error) {
        // Handle errors and return a JSON response
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: 'An error occurred during registration',
            data: undefined
        });
    }
}));
const getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserServices.getAllUser(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Users are retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
}));
const myProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserServices.myProfile(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Profile retrieved successfully',
        data: result,
    });
}));
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserServices.updateProfile(req.body, req.file, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Profile updated successfully`,
        data: result,
    });
}));
const updateUserStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield user_services_1.UserServices.updateUserStatus(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `User is now ${result.isActive ? 'active' : 'inactive'}`,
        data: result,
    });
}));
exports.UserController = {
    registerUser,
    getAllUser,
    myProfile,
    updateUserStatus,
    updateProfile,
};
