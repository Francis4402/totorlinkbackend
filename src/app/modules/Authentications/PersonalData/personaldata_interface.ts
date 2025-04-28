import { IUser } from "../User/user_interface";


export interface IDetails extends Document {
  phoneNo?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  address?: string;
  photo?: string;
  user?: IUser['_id'];
}
