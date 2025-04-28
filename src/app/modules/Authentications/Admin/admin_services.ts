import { Types } from "mongoose";
import User from "../User/user_model";




const updateUserBlockedFromDB = async (id: string) => {
    try {
        const objectId = new Types.ObjectId(id);

        
        const result = await User.updateOne(
            { _id: objectId },
            { $set: { isBlocked: true } }
        );

        return result;
    } catch (error) {
        console.error("Error user blocked status:", error);
        throw new Error("Failed to toggle user blocked status");
    }
};


export const adminServices = {
    updateUserBlockedFromDB
}