/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { httpStatus } from "../config/status";



const notFound = (req: Request, res: Response, next: NextFunction) => {
    return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        statusCode: httpStatus.NOT_FOUND,
        error: '',
    });
};

export default notFound;