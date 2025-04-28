import mongoose, { ClientSession } from "mongoose";
import { IAuth, IJwtPayload } from "./auth_interface";
import User from "../User/user_model";
import AppError from "../../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { createToken, verifyToken } from "./auth_utils";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { EmailHelper } from "../../../utils/emailHelper";


const loginUser = async (payload: IAuth) => {
   const session = await mongoose.startSession();

   try {
      session.startTransaction();

      const user = await User.findOne({ email: payload.email }).session(
         session
      );
      
      if (!user) {
         throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!');
      }

      if (!user.isActive) {
         throw new AppError(StatusCodes.FORBIDDEN, 'This user is not active!');
      }

      if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
         throw new AppError(StatusCodes.FORBIDDEN, 'Password does not match');
      }

      const jwtPayload: IJwtPayload = {
         userId: user._id as string,
         name: user.name as string,
         email: user.email as string,
         hasShop: user.hasShop,
         isActive: user.isActive,
         role: user.role,
      };

      const accessToken = createToken(
         jwtPayload,
         config.jwt_secret as string,
         config.jwt_access_expires_in as string
      );

      const refreshToken = createToken(
         jwtPayload,
         config.jwt_refresh_secret as string,
         config.jwt_refresh_expires_in as string
      );

      const updateUserInfo = await User.findByIdAndUpdate(
         user._id,
         { clientInfo: payload.clientInfo, lastLogin: Date.now() },
         { new: true, session }
      );

      await session.commitTransaction();

      return {
         accessToken,
         refreshToken,
      };
   } catch (error) {
      await session.abortTransaction();
      throw error;
   } finally {
      session.endSession();
   }
};

const refreshToken = async (token: string) => {

   let verifiedToken = null;
   try {
      verifiedToken = verifyToken(
         token,
         config.jwt_refresh_secret as unknown as string
      );
   } catch (err) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Invalid Refresh Token');
   }

   const { userId } = verifiedToken;

   const isUserExist = await User.findById(userId);
   if (!isUserExist) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User does not exist');
   }

   if (!isUserExist.isActive) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'User is not active');
   }


   const jwtPayload: IJwtPayload = {
      userId: isUserExist._id as string,
      name: isUserExist.name as string,
      email: isUserExist.email as string,
      hasShop: isUserExist.hasShop,
      isActive: isUserExist.isActive,
      role: isUserExist.role,
   };

   const newAccessToken = createToken(
      jwtPayload,
      config.jwt_secret as Secret,
      config.jwt_access_expires_in as string
   );

   return {
      accessToken: newAccessToken,
   };
};

const changePassword = async (
   userData: JwtPayload,
   payload: { oldPassword: string; newPassword: string }
) => {
   const { userId } = userData;
   const { oldPassword, newPassword } = payload;

   const user = await User.findOne({ _id: userId });
   if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
   }
   if (!user.isActive) {
      throw new AppError(StatusCodes.FORBIDDEN, 'User account is inactive');
   }

   // Validate old password
   const isOldPasswordCorrect = await User.isPasswordMatched(
      oldPassword,
      user.password
   );
   if (!isOldPasswordCorrect) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Incorrect old password');
   }

   // Hash and update the new password
   const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds)
   );
   await User.updateOne({ _id: userId }, { password: hashedPassword });

   return { message: 'Password changed successfully' };
};

const forgotPassword = async ({ email }: { email: string }) => {
   const user = await User.findOne({ email: email });

   if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
   }

   if (!user.isActive) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'User is not active!');
   }


   await User.updateOne({ email });

   try {
      const emailContent = await EmailHelper.createEmailContent(
         { userName: user.name },
         'forgotPassword'
      );

      await EmailHelper.sendEmail(email, emailContent, "Reset Password OTP");
   } catch (error) {
      await User.updateOne({ email }, { $unset: { otpToken: 1 } });

      throw new AppError(
         StatusCodes.INTERNAL_SERVER_ERROR,
         'Failed to send OTP email. Please try again later.'
      );
   }
};


const resetPassword = async ({
   token,
   newPassword,
}: {
   token: string;
   newPassword: string;
}) => {

   const session: ClientSession = await User.startSession();

   try {
      session.startTransaction();

      const decodedData = verifyToken(
         token as string,
         config.jwt_pass_reset_secret as string
      );

      const user = await User.findOne({ email: decodedData.email, isActive: true }).session(session);

      if (!user) {
         throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
      }

      const hashedPassword = await bcrypt.hash(
         String(newPassword),
         Number(config.bcrypt_salt_rounds)
      );

      await User.updateOne({ email: user.email }, { password: hashedPassword }).session(
         session
      );

      await session.commitTransaction();

      return {
         message: 'Password changed successfully',
      };
   } catch (error) {
      await session.abortTransaction();
      throw error;
   } finally {
      session.endSession();
   }
};

export const AuthService = {
   loginUser,
   refreshToken,
   changePassword,
   forgotPassword,
   resetPassword,
};
