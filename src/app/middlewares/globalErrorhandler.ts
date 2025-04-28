/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { TErrorSources } from "../interface/error";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";
import config from "../config";





const globalErrorHandler = (error: any,
    req: Request,
    res: Response,
    next: NextFunction,) => {
    
    let statusCode = 500;
    let message = 'Something went wrong!';

    let errorSources: TErrorSources = [
      {
        path: '',
        message: 'Something went wrong!',
      }
    ];
  
    if (error instanceof ZodError) {
      const simplifiedError = handleZodError(error);
      message = simplifiedError?.message;
      statusCode = simplifiedError?.statusCode;
    } else if (error?.name === 'ValidationError') {
      const simplifiedError = handleValidationError(error);
      statusCode = simplifiedError?.statusCode;
      message = simplifiedError?.message;
    } else if (error?.name === 'CastError') {
      const simplifiedError = handleCastError(error);
      statusCode = simplifiedError?.statusCode;
      message = simplifiedError?.message;
    } else if (error?.code === 11000) {
      const simplifiedError = handleDuplicateError(error);
      message = simplifiedError?.message;
      statusCode = simplifiedError?.statusCode;
    } else if (error instanceof AppError) {
      statusCode = error.statusCode;
      message = error.message;
      errorSources = [
        {
          path: '',
          message: error?.message,
        },
      ];
    } else if (error instanceof Error) {
      message = error.message;
      errorSources = [
        {
          path: '',
          message: error?.message,
        },
      ];
    }
  
    //ultimate return
    return res.status(statusCode).json({
      success: false,
      message,
      statusCode,
      error,
      stack: config.node_env === 'development' ? "error stack" : "error stack",
    });
  };
  
  export default globalErrorHandler;