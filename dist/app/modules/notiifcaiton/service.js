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
exports.NotificationServices = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const model_1 = __importDefault(require("../user/model"));
const model_2 = __importDefault(require("./model"));
const createNotification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield model_2.default.create(payload);
});
const readAllNotifications = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authUser)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User credentials is missing');
    const user = yield model_1.default.getRoleSpecificDetails(authUser.userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User account doesn't exist");
    const data = yield model_2.default.updateMany({ 'to._id': user._id }, { isRead: true }, { new: true });
    return data;
});
const getAllNotifications = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authUser)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'User credentials is missing');
    const user = yield model_1.default.getRoleSpecificDetails(authUser.userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User account doesn't exist");
    const notifications = yield model_2.default.find({ 'to._id': user._id }).sort({
        createdAt: -1,
    });
    return { notifications };
});
const getUnreadNotificationsCount = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authUser)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'User credentials is missing');
    const user = yield model_1.default.getRoleSpecificDetails(authUser.userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User account doesn't exist");
    const unreadItems = yield model_2.default.countDocuments({
        'to._id': user._id,
        isRead: false,
    });
    return { unreadItems };
});
const deleteAllNotifications = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authUser)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User credentials is missing');
    const user = yield model_1.default.getRoleSpecificDetails(authUser.userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User account doesn't exist");
    const data = yield model_2.default.deleteMany({ 'to._id': user._id });
    return data;
});
const deleteNotification = (id, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authUser)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User credentials is missing');
    const user = yield model_1.default.getRoleSpecificDetails(authUser.userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User account doesn't exist");
    const data = yield model_2.default.findByIdAndDelete(id);
    return data;
});
exports.NotificationServices = {
    createNotification,
    getUnreadNotificationsCount,
    readAllNotifications,
    getAllNotifications,
    deleteAllNotifications,
    deleteNotification,
};
