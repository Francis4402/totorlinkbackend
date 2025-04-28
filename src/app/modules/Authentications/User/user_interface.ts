import { Document, Model } from 'mongoose';

// Enum for User Roles
export enum UserRole {
   Admin = 'admin',
   Student = 'student',
   Tutor = 'tutor'
}

// User Schema Definition
export interface IUser extends Document {
   email: string;
   password: string;
   name: string;
   role: UserRole;
   hasShop: boolean;
   clientInfo: {
      device: 'pc' | 'mobile';
      browser: string;
      ipAddress: string;
      pcName?: string;
      os?: string;
      userAgent?: string;
   };
   lastLogin: Date;
   isActive: boolean;
   createdAt: Date;
   updatedAt: Date;
}

export interface UserModel extends Model<IUser> {
   
   isPasswordMatched(
      plainTextPassword: string,
      hashedPassword: string
   ): Promise<boolean>;
   isUserExistsByEmail(id: string): Promise<IUser>;
   checkUserExist(userId: string): Promise<IUser>;
}
