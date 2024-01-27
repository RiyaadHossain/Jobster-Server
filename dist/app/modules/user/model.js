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
/* eslint-disable @typescript-eslint/no-this-alias */
const user_1 = require("../../../enums/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const model_1 = __importDefault(require("../candidate/model"));
const model_2 = __importDefault(require("../company/model"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../../../config"));
const userSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true,
        select: 0,
    },
    role: { type: String, enum: Object.values(user_1.ENUM_USER_ROLE), required: true },
    candidate: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Candidate' },
    company: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    admin: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Admin' },
    status: {
        type: String,
        enum: Object.values(user_1.ENUM_USER_ACCOUNT_STATUS),
        default: user_1.ENUM_USER_ACCOUNT_STATUS.IN_ACTIVE,
    },
    confirmationToken: { type: String, select: 0 },
    confirmationTokenExpires: { type: Date, select: 0 },
    resetPasswordToken: { type: String, select: 0 },
}, { timestamps: true });
// To Hash password
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.BCRYPT_SALT_ROUNDS));
        next();
    });
});
// To check User Existence
userSchema.statics.isUserExist = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isUserExist = yield User.findOne({ id });
        return isUserExist;
    });
};
// To check User Password
userSchema.statics.isPasswordMatched = function (givenPass, savedPass) {
    return __awaiter(this, void 0, void 0, function* () {
        const isPassMatched = yield bcrypt_1.default.compare(givenPass, savedPass);
        return isPassMatched;
    });
};
// To Get Role Specific user details
userSchema.statics.getRoleSpecificDetails = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield User.findOne({ id });
        const email = user === null || user === void 0 ? void 0 : user.email;
        if ((user === null || user === void 0 ? void 0 : user.role) === user_1.ENUM_USER_ROLE.CANDIDATE)
            user = yield model_1.default.findOne({ id: id });
        if ((user === null || user === void 0 ? void 0 : user.role) === user_1.ENUM_USER_ROLE.COMPANY)
            user = yield model_2.default.findOne({ id: id });
        // @ts-ignore
        return Object.assign(Object.assign({}, user._doc), { email });
    });
};
// To Generate Token
userSchema.methods.generateToken = function () {
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const user = this;
    user.confirmationToken = token;
    const date = new Date();
    const expireDate = new Date(date.setDate(date.getDate() + 1));
    user.confirmationTokenExpires = expireDate;
    return token;
};
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
