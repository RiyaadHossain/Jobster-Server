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
exports.DashboardServices = void 0;
const model_1 = __importDefault(require("../notiifcaiton/model"));
const model_2 = __importDefault(require("../user/model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_1 = require("../../../enums/user");
const model_3 = __importDefault(require("../job/model"));
const model_4 = __importDefault(require("../application/model"));
const utils_1 = require("./utils");
const model_5 = __importDefault(require("./model"));
const constant_1 = require("./constant");
const overview = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const jobApplications = {
        type: 'job_applications',
        quantity: 0,
    };
    const profileViews = {
        type: 'profile_views',
        quantity: 0,
    };
    const unreadMessages = {
        type: 'unread_messages',
        quantity: 0,
    };
    const notifications = {
        type: 'notifications',
        quantity: 0,
    };
    const userId = authUser.userId;
    const role = authUser.role;
    const user = yield model_2.default.getRoleSpecificDetails(userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User account doesn't exist");
    if (role === user_1.ENUM_USER_ROLE.COMPANY) {
        const jobs = yield model_3.default.find({ company: user._id });
        const jobIds = jobs.map(job => job._id);
        jobApplications.quantity = yield model_4.default.countDocuments({
            job: { $in: jobIds },
        });
    }
    if (role === user_1.ENUM_USER_ROLE.CANDIDATE)
        jobApplications.quantity = yield model_4.default.countDocuments({
            candidate: user._id,
        });
    profileViews.quantity = yield model_5.default.countDocuments({ userId });
    unreadMessages.quantity = 0;
    notifications.quantity = yield model_1.default.countDocuments({
        'to._id': user._id,
    });
    return [jobApplications, profileViews, unreadMessages, notifications];
});
const profileViewStat = (authUser, totalMonths) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = authUser.userId;
    const user = yield model_2.default.getRoleSpecificDetails(userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User account doesn't exist");
    if (isNaN(totalMonths))
        totalMonths = 6;
    let lastNthMonthInfo = utils_1.DashboardUtils.getLastNthMonth(totalMonths);
    const lastDate = utils_1.DashboardUtils.getDateFromNthMonthBack(totalMonths);
    const profileViews = yield model_5.default.find({
        userId,
        viewedAt: { $gte: lastDate },
    });
    let totalViews = 0;
    lastNthMonthInfo = lastNthMonthInfo.map(date => {
        let views = 0;
        profileViews.forEach(item => {
            const month = constant_1.months[item.viewedAt.getMonth()];
            const year = item.viewedAt.getFullYear();
            if (month === date.month && year === date.year)
                views++;
        });
        totalViews += views;
        date.month = `${date.month} ${date.year.toString().slice(-2)}`;
        return Object.assign(Object.assign({}, date), { views });
    });
    return { stats: lastNthMonthInfo, total: totalViews };
});
const applicationStat = (authUser, totalMonths) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = authUser.userId;
    const user = yield model_2.default.getRoleSpecificDetails(userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User account doesn't exist");
    if (isNaN(totalMonths))
        totalMonths = 6;
    let lastNthMonthInfo = utils_1.DashboardUtils.getLastNthMonth(totalMonths);
    const lastDate = utils_1.DashboardUtils.getDateFromNthMonthBack(totalMonths);
    let applicationsReceived = [];
    // Role -> Company
    if (authUser.role === user_1.ENUM_USER_ROLE.COMPANY) {
        const jobs = yield model_3.default.find({ company: user._id });
        const jobIds = jobs.map(job => job._id);
        applicationsReceived = yield model_4.default.find({
            job: { $in: jobIds },
            createdAt: { $gte: lastDate },
        });
    }
    // Role -> Candidate
    if (authUser.role === user_1.ENUM_USER_ROLE.CANDIDATE) {
        applicationsReceived = yield model_4.default.find({
            candidate: user._id,
            createdAt: { $gte: lastDate },
        });
    }
    let totalApplications = 0;
    lastNthMonthInfo = lastNthMonthInfo.map(date => {
        let applications = 0;
        applicationsReceived.forEach(item => {
            const month = constant_1.months[item.createdAt.getMonth()];
            const year = item.createdAt.getFullYear();
            if (month === date.month && year === date.year)
                applications++;
        });
        totalApplications += applications;
        date.month = `${date.month} ${date.year.toString().slice(-2)}`;
        return Object.assign(Object.assign({}, date), { applications });
    });
    return { stats: lastNthMonthInfo, total: totalApplications };
});
exports.DashboardServices = { overview, profileViewStat, applicationStat };
