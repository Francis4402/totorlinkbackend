import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import { httpStatus } from "../../../config/status";
import AppError from "../../../errors/AppError";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AuthService } from "./auth_service";




const loginUser = catchAsync(async (req, res) => {
    
    const result = await AuthService.loginUser(req.body);
    const {refreshToken, accessToken} = result;

    res.cookie('refreshToken', refreshToken, {
        secure: config.node_env === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
        success: true,
        message: 'Login Successfull',
        statusCode: httpStatus.OK,
        data: {
            accessToken
        },
    });
});

const changePassword = catchAsync(async (req, res) => {
    const user = req.user;
    const payload = req.body;
 
    await AuthService.changePassword(user, payload);
 
    sendResponse(res, {
       statusCode: StatusCodes.OK,
       success: true,
       message: 'Password changed successfully!',
       data: null,
    });
 });

 const forgotPassword = catchAsync(async (req, res) => {
    await AuthService.forgotPassword(req.body);
    sendResponse(res, {
       statusCode: StatusCodes.OK,
       success: true,
       message: 'Check your email to reset your password',
       data: null,
    });
 });

 const resetPassword = catchAsync(async (req, res) => {
    const payload = req.body;
 
    const result = await AuthService.resetPassword(payload);
 
    sendResponse(res, {
       statusCode: StatusCodes.OK,
       success: true,
       message: 'Password reset successfully!',
       data: result,
    });
 });

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Refresh token not found in cookies');
    }

    const result = await AuthService.refreshToken(refreshToken);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access token is retrieved succesfully!',
      data: result,
    });
});

export const AuthController = {
    loginUser,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken
}