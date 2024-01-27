"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const validation_1 = require("./validation");
const router = express_1.default.Router();
router.post('/sign-in', (0, validateRequest_1.default)(validation_1.AuthValidations.signIn), controller_1.AuthControllers.signIn);
router.post('/access-token', (0, validateRequest_1.default)(validation_1.AuthValidations.accessToken), controller_1.AuthControllers.accessToken);
router.post('/change-password', (0, auth_1.default)([
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.COMPANY,
    user_1.ENUM_USER_ROLE.CANDIDATE,
]), (0, validateRequest_1.default)(validation_1.AuthValidations.changePassword), controller_1.AuthControllers.changePassword);
router.post('/forget-password', (0, validateRequest_1.default)(validation_1.AuthValidations.forgetPassword), controller_1.AuthControllers.forgetPassword);
router.post('/reset-password', (0, validateRequest_1.default)(validation_1.AuthValidations.resetPassword), controller_1.AuthControllers.resetPassword);
exports.AuthRoutes = router;
