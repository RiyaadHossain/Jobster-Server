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
exports.AuthUtils = void 0;
const emailSender_1 = require("../../../helpers/emailSender");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const config_1 = __importDefault(require("../../../config"));
const sendResetPasswordEmail = (email, token, name) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordResetURL = `${config_1.default.CLIENT_URL}/reset-password/${token}`;
    const templatePath = path_1.default.join(__dirname, '../../../views/templates/reset-password.ejs');
    const emailBody = yield ejs_1.default.renderFile(templatePath, {
        name,
        email,
        passwordResetURL,
    });
    const mailInfo = {
        to: email,
        subject: 'Reset Password',
        html: emailBody,
    };
    yield (0, emailSender_1.emailSender)(mailInfo);
});
const sendConfirmResetPasswordEmail = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const clientURL = config_1.default.CLIENT_URL;
    const templatePath = path_1.default.join(__dirname, '../../../views/templates/success-reset-password.ejs');
    const emailBody = yield ejs_1.default.renderFile(templatePath, {
        name,
        email,
        clientURL,
    });
    const mailInfo = {
        to: email,
        subject: 'Password is reset successfully',
        html: emailBody,
    };
    yield (0, emailSender_1.emailSender)(mailInfo);
});
exports.AuthUtils = {
    sendResetPasswordEmail,
    sendConfirmResetPasswordEmail,
};
