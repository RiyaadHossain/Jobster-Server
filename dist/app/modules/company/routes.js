"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRoutes = void 0;
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const validation_1 = require("./validation");
const router = express_1.default.Router();
router.get('/', controller_1.CompanyControllers.getAllCompanies);
router.patch('/edit-profile', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY]), (0, validateRequest_1.default)(validation_1.CompanyValidations.editProfile), controller_1.CompanyControllers.editProfile);
router.get('/my-jobs', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY]), controller_1.CompanyControllers.myJobs);
router.get('/applied-candidates', (0, auth_1.default)([user_1.ENUM_USER_ROLE.COMPANY]), controller_1.CompanyControllers.appliedCandidates);
router.get('/:id', (0, auth_1.default)([
    user_1.ENUM_USER_ROLE.CANDIDATE,
    user_1.ENUM_USER_ROLE.COMPANY,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
], true), controller_1.CompanyControllers.getCompany);
exports.CompanyRoutes = router;
