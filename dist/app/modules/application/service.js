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
exports.ApplicaitonServices = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const utils_1 = require("./utils");
const http_status_1 = __importDefault(require("http-status"));
const model_1 = __importDefault(require("./model"));
const application_1 = require("../../../enums/application");
const model_2 = __importDefault(require("../company/model"));
const service_1 = require("../notiifcaiton/service");
const notification_1 = require("../../../enums/notification");
const user_1 = require("../../../enums/user");
const model_3 = __importDefault(require("../candidate/model"));
const model_4 = __importDefault(require("../job/model"));
const job_1 = require("../../../enums/job");
const apply = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield model_4.default.findById(payload.job);
    if (!job)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Job offer doesn't exist");
    const company = yield model_2.default.findById(job.company);
    if (!company)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Company doesn't exist anymore");
    const candidate = yield model_3.default.findOne({ id: userId });
    if (!candidate)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Candidate account not exist');
    if (job.status === job_1.ENUM_JOB_STATUS.CLOSED)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Job offer is closed');
    const alreadyApplied = yield model_1.default.findOne({
        job: payload.job,
        candidate: candidate._id,
    });
    if (alreadyApplied)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Already applied for this job');
    payload.candidate = candidate._id;
    const data = yield model_1.default.create(payload);
    // Send notification to company
    const notificationPayload = {
        type: notification_1.ENUM_NOFICATION_TYPE.APPLY,
        from: {
            _id: candidate._id,
            name: candidate.name,
            role: user_1.ENUM_USER_ROLE.CANDIDATE,
        },
        to: { _id: company._id, name: company.name, role: user_1.ENUM_USER_ROLE.COMPANY },
        job: job,
    };
    service_1.NotificationServices.createNotification(notificationPayload);
    return data;
});
const myApplications = (userId, searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const candidate = yield utils_1.ApplicationUtils.isCandidateExist(userId);
    if (!candidate)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Candidate account not exist');
    const data = yield model_1.default.find({
        candidate: candidate._id,
    }).populate({
        path: 'job',
        select: '_id title company industry employmentType location',
        populate: { path: 'company', select: '_id name logo industry location' },
    });
    let filteredData = data;
    if (searchTerm)
        filteredData = data.filter(item => {
            var _a, _b, _c, _d, _e;
            searchTerm = searchTerm === null || searchTerm === void 0 ? void 0 : searchTerm.toLowerCase();
            const jobTitle = (_b = (_a = item === null || item === void 0 ? void 0 : item.job) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            const companyName = (_e = (_d = (_c = item === null || item === void 0 ? void 0 : item.job) === null || _c === void 0 ? void 0 : _c.company) === null || _d === void 0 ? void 0 : _d.name) === null || _e === void 0 ? void 0 : _e.toLowerCase();
            // @ts-ignore
            return jobTitle.includes(searchTerm) || companyName.includes(searchTerm);
        });
    return filteredData;
});
const updateStatus = (id, status, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield model_1.default.findById(id).populate('job');
    if (!application)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Job application doesn't exist");
    const company = yield model_2.default.findOne({ id: userId });
    if (!company)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Company account not exist');
    //@ts-ignore
    if (!application.job.company.equals(company._id))
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This application is not belong to your job');
    if (application.status !== application_1.ENUM_APPLICATION_STATUS.PENDING)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Already ${application.status} the application`);
    const data = yield model_1.default.findByIdAndUpdate(id, { status }, {
        new: true,
        runValidators: true,
    });
    // Send notification to candidate
    const type = status === application_1.ENUM_APPLICATION_STATUS.ACCEPTED
        ? notification_1.ENUM_NOFICATION_TYPE.APPLICATION_ACCEPTED
        : notification_1.ENUM_NOFICATION_TYPE.APPLICATIN_REJECTED;
    const candidate = yield model_3.default.findById(application.candidate);
    const job = yield model_4.default.findById(application.job);
    if (!candidate || !job)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Candidate/job doesn't exist anymore");
    const notificationPayload = {
        type,
        from: {
            _id: company._id,
            name: company.name,
            role: user_1.ENUM_USER_ROLE.COMPANY,
        },
        to: {
            _id: candidate._id,
            name: candidate.name,
            role: user_1.ENUM_USER_ROLE.CANDIDATE,
        },
        job,
    };
    service_1.NotificationServices.createNotification(notificationPayload);
    return data;
});
const remove = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield model_1.default.findById(id);
    if (!application)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Job application doesn't exist");
    const candidate = yield utils_1.ApplicationUtils.isCandidateExist(userId);
    if (!candidate)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Candidate account not exist');
    if (!application.candidate.equals(candidate._id))
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "You can't delete this application");
    if (application.status !== application_1.ENUM_APPLICATION_STATUS.PENDING)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Application is already ${application.status}`);
    const data = yield model_1.default.findByIdAndDelete(id);
    return data;
});
exports.ApplicaitonServices = {
    apply,
    myApplications,
    updateStatus,
    remove,
};
