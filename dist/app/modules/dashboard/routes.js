"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const auth_1 = __importDefault(require("../../../app/middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.get('/overview', (0, auth_1.default)([
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.CANDIDATE,
    user_1.ENUM_USER_ROLE.COMPANY,
]), controller_1.DashboardControllers.overview);
router.get('/stat/profile-view', (0, auth_1.default)([user_1.ENUM_USER_ROLE.CANDIDATE, user_1.ENUM_USER_ROLE.COMPANY]), controller_1.DashboardControllers.profileViewStat);
router.get('/stat/application', (0, auth_1.default)([user_1.ENUM_USER_ROLE.CANDIDATE, user_1.ENUM_USER_ROLE.COMPANY]), controller_1.DashboardControllers.applicationStat);
exports.DashboardRoutes = router;
