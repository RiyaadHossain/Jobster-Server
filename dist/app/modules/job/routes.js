"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRoutes = void 0;
const auth_1 = __importDefault(require("../../../app/middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../app/middlewares/validateRequest"));
const user_1 = require("../../../enums/user");
const express_1 = __importDefault(require("express"));
const validation_1 = require("./validation");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY]), (0, validateRequest_1.default)(validation_1.JobValidations.createJob), controller_1.JobControllers.createJob);
router.get('/', controller_1.JobControllers.getAllJobs);
router.get('/type-specific', controller_1.JobControllers.getTypeSpecifiJobs);
router.get('/:id', (0, auth_1.default)([
    user_1.ENUM_USER_ROLE.CANDIDATE,
    user_1.ENUM_USER_ROLE.COMPANY,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
], true), controller_1.JobControllers.getJob);
router.patch('/:id', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY]), (0, validateRequest_1.default)(validation_1.JobValidations.updateJob), controller_1.JobControllers.updateJob);
router.delete('/:id', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY]), controller_1.JobControllers.deleteJob);
exports.JobRoutes = router;
