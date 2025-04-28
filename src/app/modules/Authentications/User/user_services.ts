import mongoose from "mongoose";
import { IUser, UserRole } from "./user_interface";
import AppError from "../../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../Auth/auth_service";
import { IJwtPayload } from "../Auth/auth_interface";
import Customer from "../PersonalData/personaldata_model";
import { UserSearchableFields } from "./user_constant";
import QueryBuilder from "../../../builder/QueryBuilder";
import { IImageFile } from "../../../interface/IImageFile";
import User from "./user_model";
import { IDetails } from "../PersonalData/personaldata_interface";


// Function to register user
const registerUser = async (userData: IUser) => {

   const session = await mongoose.startSession();
   session.startTransaction();

   try {
      if ([UserRole.Admin].includes(userData.role)) {
         throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid role. Only User is allowed.');
      }

      // Check if the user already exists by email
      const existingUser = await User.findOne({ email: userData.email }).session(session);
      if (existingUser) {
         throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Email is already registered');
      }

      // Create the user
      const user = new User(userData);
      const createdUser = await user.save({ session });

      const profile = new Customer({
         user: createdUser._id,
      });

      await profile.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return await AuthService.loginUser({ email: createdUser.email, password: userData.password, clientInfo: userData.clientInfo });
   } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();
      session.endSession();
      throw error;
   }
};


const getAllUser = async (query: Record<string, unknown>) => {
   const UserQuery = new QueryBuilder(User.find(), query)
      .search(UserSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

   const result = await UserQuery.modelQuery;
   const meta = await UserQuery.countTotal();
   return {
      result,
      meta,
   };
};

const myProfile = async (authUser: IJwtPayload) => {
   const isUserExists = await User.findById(authUser.userId);
   if (!isUserExists) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
   }
   if (!isUserExists.isActive) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User is not active!");
   }

   const profile = await Customer.findOne({ user: isUserExists._id });


   return {
      ...isUserExists.toObject(),
      profile: profile || null
   }

}

const updateProfile = async (
   payload: Partial<IDetails>,
   file: IImageFile,
   authUser: IJwtPayload
) => {
   const isUserExists = await User.findById(authUser.userId);

   if (!isUserExists) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
   }
   if (!isUserExists.isActive) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User is not active!");
   }

   if (file && file.path) {
      payload.photo = file.path;
   }

   const result = await Customer.findOneAndUpdate(
      { user: authUser.userId },
      payload,
      {
         new: true,
      }
   ).populate('user');

   return result;
};

const updateUserStatus = async (userId: string) => {
   const user = await User.findById(userId);

   console.log('comes here');
   if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User is not found');
   }

   user.isActive = !user.isActive;
   const updatedUser = await user.save();
   return updatedUser;
};

export const UserServices = {
   registerUser,
   getAllUser,
   myProfile,
   updateUserStatus,
   updateProfile,
};
