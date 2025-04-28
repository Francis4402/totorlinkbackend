import config from "../config";
import { httpStatus } from "../config/status";
import AppError from "../errors/AppError";
import { UserRole } from "../modules/Authentications/User/user_interface";
import User from "../modules/Authentications/User/user_model";


import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from 'jsonwebtoken';


const auth = (...requiredRoles: UserRole[]) => {

    return catchAsync(async (req, res, next) => {

        const token = req.headers.authorization;
  
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }
  
      const decoded = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload;

      const {role, email} = decoded;

      const user = await User.findOne({email, role, isActive: true});

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
      }

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You are not authorized  hi!"
        );
      }

      req.user = decoded as JwtPayload & { role: string };

      next();
    });
};

export default auth;