"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    phoneNo: {
        type: String,
        validate: {
            validator: function (v) {
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
            validator: function (v) {
                return /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg))/.test(v);
            },
            message: 'Invalid photo URL format.',
        },
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
const Customer = (0, mongoose_1.model)('Customer', customerSchema);
exports.default = Customer;
