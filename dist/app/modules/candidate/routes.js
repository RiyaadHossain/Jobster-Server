"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateRoutes = void 0;
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const validation_1 = require("./validation");
const fileUploader_1 = require("../../../helpers/fileUploader");
const router = express_1.default.Router();
router.get('/', controller_1.CandidateControllers.getAllCandidates);
router.get('/:id', (0, auth_1.default)([
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.COMPANY,
    user_1.ENUM_USER_ROLE.CANDIDATE,
], true), controller_1.CandidateControllers.getCandidate);
router.patch('/edit-profile', (0, auth_1.default)([user_1.ENUM_USER_ROLE.CANDIDATE]), (0, validateRequest_1.default)(validation_1.CandidateValidations.editProfile), controller_1.CandidateControllers.editProfile);
router.post('/upload-resume', (0, auth_1.default)([user_1.ENUM_USER_ROLE.CANDIDATE]), fileUploader_1.FileUploader.upload.single('resume'), controller_1.CandidateControllers.uploadResume);
router.delete('/delete-resume', (0, auth_1.default)([user_1.ENUM_USER_ROLE.CANDIDATE]), controller_1.CandidateControllers.deleteResume);
exports.CandidateRoutes = router;
