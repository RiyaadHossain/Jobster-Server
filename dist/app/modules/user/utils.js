"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUtils = void 0;
const user_1 = require("../../../enums/user");
const model_1 = __importDefault(require("./model"));
const emailSender_1 = require("../../../helpers/emailSender");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../../config"));
const getLastUserId = (role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield model_1.default.findOne({ role }).sort({ createdAt: -1 });
    return user === null || user === void 0 ? void 0 : user.id.substr(3);
});
const generateId = (role) => __awaiter(void 0, void 0, void 0, function* () {
    let prefix = 'AD';
    if (role !== user_1.ENUM_USER_ROLE.ADMIN)
        prefix = role === user_1.ENUM_USER_ROLE.CANDIDATE ? 'CA' : 'CO';
    const lastUserId = (yield getLastUserId(role)) || String(0).padStart(5, '0');
    let generatedId = (parseInt(lastUserId) + 1).toString().padStart(5, '0');
    generatedId = `${prefix}-${generatedId}`;
    return generatedId;
});
const validateImageField = (userRole, filedName) => {
    let isValid = true;
    let error = '';
    if (userRole === user_1.ENUM_USER_ROLE.CANDIDATE) {
        if (filedName !== 'avatar' && filedName !== 'banner') {
            isValid = false;
            error = 'Field name must be avatar/banner';
        }
    }
    if (userRole === user_1.ENUM_USER_ROLE.COMPANY) {
        if (filedName !== 'logo' && filedName !== 'banner') {
            isValid = false;
            error = 'Field name must be logo/banner';
        }
    }
    return { isValid, error };
};
const sendConfirmationEmail = ({ email, token, name, }) => __awaiter(void 0, void 0, void 0, function* () {
    const confirmationURL = `${config_1.default.CLIENT_URL}/confirm-account/${name}/${token}`;
    const templatePath = path_1.default.join(__dirname, '../../../views/templates/confirm-email.ejs');
    const emailContent = yield ejs_1.default.renderFile(templatePath, {
        name,
        confirmationURL,
    });
    const mailInfo = {
        to: email,
        subject: 'Confirm Your Account',
        html: emailContent,
    };
    yield (0, emailSender_1.emailSender)(mailInfo);
});
exports.UserUtils = {
    generateId,
    validateImageField,
    sendConfirmationEmail,
};
