import mongoose, { Schema } from 'mongoose';

import bcrypt from 'bcrypt';

import { StatusCodes } from 'http-status-codes';
import { IUser, UserModel, UserRole } from './user_interface';
import config from '../../../config';
import AppError from '../../../errors/AppError';

// Create the User schema based on the interface
const userSchema = new Schema<IUser, UserModel>(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
      },
      password: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         enum: [UserRole.Admin, UserRole.Student, UserRole.Tutor],
      },
      hasShop: {
         type: Boolean,
         default: false,
      },
      clientInfo: {
         device: {
            type: String,
            enum: ['pc', 'mobile'],
            required: true,
         },
         browser: {
            type: String,
            required: true,
         },
         ipAddress: {
            type: String,
            required: true,
         },
         pcName: {
            type: String,
         },
         os: {
            type: String,
         },
         userAgent: {
            type: String,
         },
      },
      lastLogin: {
         type: Date,
         default: Date.now,
      },
      isActive: {
         type: Boolean,
         default: true,
      },
   },
   {
      timestamps: true,
   }
);

userSchema.pre('save', async function (next) {
   const user = this;

   user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
   );

   next();
});

userSchema.post('save', function (doc, next) {
   doc.password = '';
   next();
});

userSchema.set('toJSON', {
   transform: (_doc, ret) => {
      delete ret.password;
      return ret;
   },
});

userSchema.statics.isPasswordMatched = async function (
   plainTextPassword,
   hashedPassword
) {
   return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
   return await User.findOne({ email }).select('+password');
};

userSchema.statics.checkUserExist = async function (userId: string) {
   const existingUser = await this.findById(userId);

   if (!existingUser) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'User does not exist!');
   }

   if (!existingUser.isActive) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'User is not active!');
   }

   return existingUser;
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);
export default User;
