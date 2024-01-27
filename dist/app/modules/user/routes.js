"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const validation_1 = require("./validation");
const auth_1 = __importDefault(require("../../../app/middlewares/auth"));
const user_1 = require("../../../enums/user");
const fileUploader_1 = require("../../../helpers/fileUploader");
const router = express_1.default.Router();
router.get('/me', (0, auth_1.default)([
    user_1.ENUM_USER_ROLE.COMPANY,
    user_1.ENUM_USER_ROLE.CANDIDATE,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
]), controller_1.UserControllers.me);
router.post('/sign-up', (0, validateRequest_1.default)(validation_1.UserValidations.signUp), controller_1.UserControllers.signUp);
router.get('/confirm-account/:name/:token', controller_1.UserControllers.confirmAccount);
router.post('/upload-image', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY, user_1.ENUM_USER_ROLE.CANDIDATE]), fileUploader_1.FileUploader.upload.single('image'), controller_1.UserControllers.uploadImage);
router.get('/get-image', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY, user_1.ENUM_USER_ROLE.CANDIDATE]), controller_1.UserControllers.getImageUrl);
exports.UserRoutes = router;
