"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const status_1 = require("../config/status");
const notFound = (req, res, next) => {
    return res.status(status_1.httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        statusCode: status_1.httpStatus.NOT_FOUND,
        error: '',
    });
};
exports.default = notFound;
