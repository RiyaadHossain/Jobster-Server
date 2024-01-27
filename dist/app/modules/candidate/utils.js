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
exports.CandidateUtils = void 0;
const http_status_1 = __importDefault(require("http-status"));
const model_1 = __importDefault(require("../dashboard/model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const model_2 = __importDefault(require("../user/model"));
const notification_1 = require("../../../enums/notification");
const service_1 = require("../notiifcaiton/service");
const countProfileView = (authUser, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // if user himself viewing his own profile
    if ((authUser === null || authUser === void 0 ? void 0 : authUser.userId) === (user === null || user === void 0 ? void 0 : user.id))
        return;
    const currentMin = new Date();
    const oneMinEarlier = new Date(currentMin.setMinutes(currentMin.getMinutes() - 2));
    const viewed = yield model_1.default.findOne({
        userId: user === null || user === void 0 ? void 0 : user._id,
        viewedBy: authUser === null || authUser === void 0 ? void 0 : authUser.userId,
        viewedAt: { $gte: oneMinEarlier },
    });
    if (!viewed && authUser && user) {
        yield model_1.default.create({
            userId: user.id,
            viewedBy: authUser.userId,
        });
        // Send notification to user
        const sender = yield model_2.default.getRoleSpecificDetails(authUser.userId);
        if (!sender)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Notification sender account doesn't exist");
        const receiverRole = (_a = (yield model_2.default.findOne({ id: user.id }))) === null || _a === void 0 ? void 0 : _a.role;
        const notificationPayload = {
            type: notification_1.ENUM_NOFICATION_TYPE.PROFILE_VIEW,
            from: { _id: sender._id, name: sender.name, role: authUser.role },
            to: {
                _id: user._id,
                name: user.name,
                role: receiverRole,
            },
        };
        service_1.NotificationServices.createNotification(notificationPayload);
    }
});
exports.CandidateUtils = { countProfileView };
