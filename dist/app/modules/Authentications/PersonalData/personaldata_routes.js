"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const personaldata_controller_1 = require("./personaldata_controller");
const router = (0, express_1.Router)();
// Define routes
router.get('/', personaldata_controller_1.personalDetailController.getAll);
exports.default = router;
