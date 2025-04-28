"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: ['http://localhost:3000'], credentials: true }));
app.get('/', (req, res) => {
    res.send('TutorLink');
});
app.use('/api', routes_1.default);
app.use((error, req, res, next) => {
    (0, globalErrorhandler_1.default)(error, req, res, next);
});
//Not Found
app.use((req, res, next) => {
    (0, notFound_1.default)(req, res, next);
});
exports.default = app;
