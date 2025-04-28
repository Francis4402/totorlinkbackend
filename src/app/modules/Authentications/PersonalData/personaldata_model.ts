import { Schema, model } from 'mongoose';
import { IDetails } from './personaldata_interface';


const personalDetailSchema = new Schema<IDetails>({
  phoneNo: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^\d{11}$/.test(v);
      },
      message: 'Phone number must be 11 digits long',
    },
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Other',
  },
  dateOfBirth: {
    type: String,
  },
  address: {
    type: String
  },
  photo: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg))/.test(v);
      },
      message: 'Invalid photo URL format.',
    },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const PersonalData = model<IDetails>('PersonalDetails', personalDetailSchema);

export default PersonalData;
