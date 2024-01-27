"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validation_1 = require("./validation");
const validateRequest_1 = __importDefault(require("../../../app/middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../../app/middlewares/auth"));
const user_1 = require("../../../enums/user");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.post('/apply', (0, auth_1.default)([user_1.ENUM_USER_ROLE.CANDIDATE]), (0, validateRequest_1.default)(validation_1.ApplicationValidations.apply), controller_1.ApplicationControllers.apply);
router.get('/my-applications', (0, auth_1.default)([user_1.ENUM_USER_ROLE.CANDIDATE]), controller_1.ApplicationControllers.myApplications);
router.patch('/update-status/:id', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY]), (0, validateRequest_1.default)(validation_1.ApplicationValidations.updateStatus), controller_1.ApplicationControllers.updateStatus);
router.delete('/remove/:id', (0, auth_1.default)([user_1.ENUM_USER_ROLE.CANDIDATE]), controller_1.ApplicationControllers.remove);
exports.ApplicationRoutes = router;
