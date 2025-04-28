import { AnyObject } from "mongoose";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";


const validateRequest = (schema: AnyObject) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // validation check
        //if everything allright next() ->
        // console.log(req.body, 'req.body');
        await schema.parseAsync({
          body: req.body,
        });
  
        next();
    }
  )
};

export default validateRequest;
