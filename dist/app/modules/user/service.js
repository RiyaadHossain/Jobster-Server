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
exports.UserServices = void 0;
const user_1 = require("../../../enums/user");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const model_1 = __importDefault(require("../candidate/model"));
const model_2 = __importDefault(require("../company/model"));
const model_3 = __importDefault(require("./model"));
const utils_1 = require("./utils");
const fileUploader_1 = require("../../../helpers/fileUploader");
const file_1 = require("../../../enums/file");
const fs_1 = require("fs");
const me = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield model_3.default.findOne({
        id,
    });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User account doesn't exist");
    user = yield model_3.default.getRoleSpecificDetails(id);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User account is inactive');
    return user;
});
const signUp = (payload, name) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Is user exist
    const isExist = yield model_3.default.findOne({
        email: payload.email,
        status: user_1.ENUM_USER_ACCOUNT_STATUS.ACTIVE,
    });
    if (isExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User account is already exist');
    // 2. Delete inactivated user with same email
    yield model_3.default.deleteOne({ email: payload.email });
    // 3. Generate userId and hash password
    const id = yield utils_1.UserUtils.generateId(payload.role);
    payload.id = id;
    const user = yield model_3.default.create(payload);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user account');
    // 4. Send Confirmation Email to User
    const email = user.email;
    const token = user.generateToken();
    yield utils_1.UserUtils.sendConfirmationEmail({ email, token, name });
    // 5. Finally Save user doc
    yield user.save();
});
const confirmAccount = (name, token) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check user existence
    const user = yield model_3.default.findOne({ confirmationToken: token }).select('+confirmationToken +confirmationTokenExpires');
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Token');
    // 2. Check Token Expire Date
    const expired = new Date() > user.confirmationTokenExpires;
    if (expired)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User Token Expired!');
    // 3. Create Candidate/Company account
    const userInfo = { id: user.id, name };
    if (user.role === user_1.ENUM_USER_ROLE.CANDIDATE) {
        const candidate = yield model_1.default.create(userInfo);
        if (!candidate)
            throw new ApiError_1.default(http_status_1.default.FAILED_DEPENDENCY, 'Failed to create candidate account');
        user.candidate = candidate._id;
    }
    if (user.role === user_1.ENUM_USER_ROLE.COMPANY) {
        const company = yield model_2.default.create(userInfo);
        if (!company)
            throw new ApiError_1.default(http_status_1.default.FAILED_DEPENDENCY, 'Failed to create company account');
        user.company = company._id;
    }
    // 4. Update User Info
    user.status = user_1.ENUM_USER_ACCOUNT_STATUS.ACTIVE;
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;
    yield user.save();
    return user;
});
const uploadImage = (authUser, filedName, file) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = authUser;
    if (!file)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Must upload an Image');
    // 1. Validate image field name
    const { isValid, error } = utils_1.UserUtils.validateImageField(role, filedName);
    if (!isValid) {
        (0, fs_1.unlinkSync)(file.path);
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, error);
    }
    // 2. Check user account
    const user = yield model_3.default.findOne({ id: userId });
    if (!user) {
        (0, fs_1.unlinkSync)(file.path);
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User account doesn't exist!");
    }
    // 3. Upload Image
    const uploadImage = yield fileUploader_1.FileUploader.uploadToCloudinary(file, file_1.ENUM_FILE_TYPE.IMAGE);
    const imageUrl = uploadImage.secure_url;
    // 4. Save image url
    if (user.role === user_1.ENUM_USER_ROLE.CANDIDATE)
        yield model_1.default.findOneAndUpdate({ id: userId }, { [filedName]: imageUrl });
    else
        yield model_2.default.findOneAndUpdate({ id: userId }, { [filedName]: imageUrl });
    return { imageUrl };
});
const getImageUrl = (id, fieldName) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield model_3.default.getRoleSpecificDetails(id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User account doesn't exist!");
    }
    // @ts-ignore
    const imageUrl = user[fieldName] || null;
    return { imageUrl };
});
exports.UserServices = {
    me,
    signUp,
    confirmAccount,
    uploadImage,
    getImageUrl,
};
