"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user_interface");
const clientInfoSchema = zod_1.z.object({
    device: zod_1.z.enum(['pc', 'mobile']).optional().default('pc'), // Allow only 'pc' or 'mobile'
    browser: zod_1.z.string().min(1, 'Browser name is required'),
    ipAddress: zod_1.z.string().min(1, 'IP address is required'),
    pcName: zod_1.z.string().optional(), // Optional field
    os: zod_1.z.string().optional(), // Optional field
    userAgent: zod_1.z.string().min(1, 'User agent is required'),
});
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
        name: zod_1.z.string().min(1, 'Name is required'),
        role: zod_1.z.enum([user_interface_1.UserRole.Student, user_interface_1.UserRole.Tutor, user_interface_1.UserRole.Admin]),
        clientInfo: clientInfoSchema
    })
});
const studentInfoValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        phoneNo: zod_1.z
            .string()
            .regex(/^\d{11}$/, 'Phone number must be exactly 11 digits long')
            .optional(),
        gender: zod_1.z
            .enum(['Male', 'Female', 'Other'])
            .default('Other')
            .optional(),
        dateOfBirth: zod_1.z
            .string()
            .optional()
            .refine((value) => !value || !isNaN(Date.parse(value)), {
            message: 'Invalid date format. Must be a valid date.',
        })
            .optional(),
        address: zod_1.z
            .string()
            .optional(),
        photo: zod_1.z
            .string()
            .regex(/^(http(s)?:\/\/.*\.(?:png|jpg|jpeg))$/, 'Invalid photo URL format. Must be a valid image URL.')
            .optional(),
    })
        .strict(),
});
exports.UserValidation = {
    userValidationSchema,
    studentInfoValidationSchema
};
