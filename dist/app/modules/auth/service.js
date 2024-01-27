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
exports.AuthServices = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const _config_1 = __importDefault(require("../../../config"));
const http_status_1 = __importDefault(require("http-status"));
const model_1 = __importDefault(require("../user/model"));
const utils_1 = require("./utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../../../enums/user");
const signIn = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    // Check User Existence
    const userExist = yield model_1.default.findOne({ email }).select('+password');
    if (!userExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist!");
    }
    if (userExist.status !== user_1.ENUM_USER_ACCOUNT_STATUS.ACTIVE)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User account is not active');
    // Check Password
    const isPassMatched = yield model_1.default.isPasswordMatched(password, userExist.password);
    if (!isPassMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect!');
    }
    const { id: userId, role } = userExist;
    // Generate Tokens
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({ userId, role }, _config_1.default.JWT.SECRET, _config_1.default.JWT.SECRET_EXPIRE);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({ userId, role }, _config_1.default.JWT.REFRESH, _config_1.default.JWT.REFRESH_EXPIRE);
    return { accessToken, refreshToken };
});
const accessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Refresh Token Verificaiton
    const decoded = jwtHelpers_1.jwtHelpers.verifyToken(token, _config_1.default.JWT.REFRESH);
    const { userId, role } = decoded;
    // Check User Existence
    const userExist = yield model_1.default.isUserExist(userId);
    if (!userExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist!");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({ userId, role }, _config_1.default.JWT.SECRET, _config_1.default.JWT.SECRET_EXPIRE);
    return { accessToken };
});
const changePassword = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    // Check User Existence
    const userExist = yield model_1.default.findOne({ id: userId }).select('+password');
    if (!userExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist!");
    }
    // Check Password
    const isPassMatched = yield model_1.default.isPasswordMatched(oldPassword, userExist.password);
    if (!isPassMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect!');
    }
    userExist.password = newPassword;
    yield userExist.save();
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 1. Check User Existence
    const user = yield model_1.default.findOne({ email });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Email');
    // 2. Generate JWT token using userId
    const payload = { userId: user.id };
    const token = jwtHelpers_1.jwtHelpers.generateToken(payload, _config_1.default.JWT.RESET_PASSWORD_SECRET, _config_1.default.JWT.RESET_PASSWORD_EXPIRE);
    // 3. Hash the token
    const hashedToken = yield bcrypt_1.default.hash(token, Number(_config_1.default.BCRYPT_SALT_ROUNDS));
    // 4. Save to DB
    user.resetPasswordToken = hashedToken;
    yield user.save();
    // 5. Send reset email to user
    const name = ((_a = (yield model_1.default.getRoleSpecificDetails(user.id))) === null || _a === void 0 ? void 0 : _a.name) || email;
    yield utils_1.AuthUtils.sendResetPasswordEmail(email, token, name);
});
const resetPassword = (resetCredential) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { token, newPassword } = resetCredential;
    if (!token)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Token');
    // 1. Decode the token
    const decoded = jwtHelpers_1.jwtHelpers.verifyToken(token, _config_1.default.JWT.RESET_PASSWORD_SECRET);
    // 2. Check user token existence
    const userId = decoded.userId;
    const user = yield model_1.default.findOne({ id: userId }).select('+resetPasswordToken');
    if (!(user === null || user === void 0 ? void 0 : user.resetPasswordToken))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Token');
    // 3. Check is token mathced (extra step)
    const tokenMatched = yield bcrypt_1.default.compare(token, user.resetPasswordToken);
    if (!tokenMatched)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Token');
    user.resetPasswordToken = undefined;
    // 4. Save new password
    user.password = newPassword;
    yield user.save();
    // 5. Sent reset confirmation password email
    const name = ((_b = (yield model_1.default.getRoleSpecificDetails(user.id))) === null || _b === void 0 ? void 0 : _b.name) || user.email;
    yield utils_1.AuthUtils.sendConfirmResetPasswordEmail(user.email, name);
});
exports.AuthServices = {
    signIn,
    accessToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
