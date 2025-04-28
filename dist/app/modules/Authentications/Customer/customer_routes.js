"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("./customer_controller");
const router = (0, express_1.Router)();
// Define routes
router.get('/', customer_controller_1.customerController.getAll);
exports.default = router;
