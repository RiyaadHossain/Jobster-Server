"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const auth_1 = __importDefault(require("../../../app/middlewares/auth"));
const user_1 = require("../../../enums/user");
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY, user_1.ENUM_USER_ROLE.CANDIDATE]), controller_1.NotificationControllers.getAllNotifications);
router.get('/unread', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY, user_1.ENUM_USER_ROLE.CANDIDATE]), controller_1.NotificationControllers.getUnreadNotificationsCount);
router.patch('/read-all', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY, user_1.ENUM_USER_ROLE.CANDIDATE]), controller_1.NotificationControllers.readAllNotifications);
router.delete('/', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY, user_1.ENUM_USER_ROLE.CANDIDATE]), controller_1.NotificationControllers.deleteAllNotifications);
router.delete('/:id', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY, user_1.ENUM_USER_ROLE.CANDIDATE]), controller_1.NotificationControllers.deleteNotification);
exports.NotificationRoutes = router;
