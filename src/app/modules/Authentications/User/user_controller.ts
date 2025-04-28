import { Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { UserServices } from './user_services';
import config from '../../../config';
import sendResponse from '../../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { IJwtPayload } from '../Auth/auth_interface';
import { IImageFile } from '../../../interface/IImageFile';


const registerUser = catchAsync(async (req: Request, res: Response) => {
   try {
       const result = await UserServices.registerUser(req.body);

       const { refreshToken, accessToken } = result;

       res.cookie('refreshToken', refreshToken, {
           secure: config.node_env === 'production',
           httpOnly: true,
           sameSite: 'none',
           maxAge: 1000 * 60 * 60 * 24 * 365,
       });

       sendResponse(res, {
           statusCode: StatusCodes.OK,
           success: true,
           message: 'User registration completed successfully!',
           data: {
               accessToken,
           },
       });
   } catch (error) {
       // Handle errors and return a JSON response
       sendResponse(res, {
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'An error occurred during registration',
          data: undefined
       });
   }
});


const getAllUser = catchAsync(async (req, res) => {
   const result = await UserServices.getAllUser(req.query);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Users are retrieved successfully',
      meta: result.meta,
      data: result.result,
   });
});

const myProfile = catchAsync(async (req, res) => {
   const result = await UserServices.myProfile(req.user as IJwtPayload);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Profile retrieved successfully',
      data: result,
   });
});

const updateProfile = catchAsync(async (req, res) => {
   const result = await UserServices.updateProfile(
      req.body,
      req.file as IImageFile,
      req.user as IJwtPayload
   );

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Profile updated successfully`,
      data: result,
   });
});

const updateUserStatus = catchAsync(async (req, res) => {
   const userId = req.params.id;
   const result = await UserServices.updateUserStatus(userId);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `User is now ${result.isActive ? 'active' : 'inactive'}`,
      data: result,
   });
});

export const UserController = {
   registerUser,
   getAllUser,
   myProfile,
   updateUserStatus,
   updateProfile,
};
