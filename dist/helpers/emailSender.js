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
exports.emailSender = void 0;
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailSender = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Step 1: Creating the transporter
        const transporter = nodemailer_1.default.createTransport({
            host: config_1.default.SMTP.HOST,
            port: Number(config_1.default.SMTP.PORT),
            secure: false,
            auth: {
                user: config_1.default.SMTP.EMAIL,
                pass: config_1.default.SMTP.PASS,
            },
        });
        //Step 2: Setting up message options
        const messageOptions = {
            from: '"Jobster 💼" <jobster@gmail.com>',
            to: payload.to,
            subject: payload.subject,
            text: payload.text,
            html: payload.html,
        };
        //Step 3: Sending email
        transporter.sendMail(messageOptions);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FAILED_DEPENDENCY, 'Failed to send email');
    }
});
exports.emailSender = emailSender;
