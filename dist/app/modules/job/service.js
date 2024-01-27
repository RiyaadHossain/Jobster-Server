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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobServices = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const model_1 = __importDefault(require("./model"));
const http_status_1 = __importDefault(require("http-status"));
const model_2 = __importDefault(require("../company/model"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const model_3 = __importDefault(require("../user/model"));
const job_1 = require("../../../enums/job");
const createJob = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const companyId = (_a = (yield model_2.default.findOne({ id: userId }))) === null || _a === void 0 ? void 0 : _a._id;
    if (!companyId)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Company doesn't exist");
    payload.company = companyId;
    const jobExist = yield model_1.default.findOne({
        company: companyId,
        title: payload.title,
    });
    if (jobExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'A Job offer with same name already exist');
    const data = yield model_1.default.create(payload);
    return data;
});
const getAllJobs = (pagination, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortOrder, sortBy } = paginationHelper_1.paginationHelpers.calculatePagination(pagination);
    // Sort condition
    const sortCondition = {};
    sortCondition[sortBy] = sortOrder;
    // Filter Options
    const { title, workLevel, employmentType } = filters, filtersData = __rest(filters, ["title", "workLevel", "employmentType"]);
    const andConditions = [];
    // Search by Job Title
    if (title) {
        andConditions.push({
            title: { $regex: title, $options: 'i' },
        });
    }
    // Search by Location + Industry
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: { $regex: value, $options: 'i' },
            })),
        });
    }
    // Filter by Work Level
    if (workLevel) {
        const arrayOfWorkLevel = workLevel.split(',');
        andConditions.push({
            workLevel: { $in: arrayOfWorkLevel },
        });
    }
    // Filter by Employment Type
    if (employmentType) {
        const arrayOfEmployemploymentType = employmentType.split(',');
        andConditions.push({
            employmentType: { $in: arrayOfEmployemploymentType },
        });
    }
    const whereCondition = andConditions.length ? { $and: andConditions } : {};
    const jobs = yield model_1.default.find(whereCondition)
        .populate({ path: 'company', select: '_id name logo' })
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const total = yield model_1.default.countDocuments(whereCondition);
    const totalPages = Math.ceil(total / limit);
    const meta = { total, page, limit, totalPages };
    return { meta, data: jobs };
});
const getTypeSpecifiJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    const employmentType = yield Promise.all(Object.values(job_1.ENUM_EMPLOYMENT_TYPE).map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const jobs = yield model_1.default.countDocuments({ employmentType: item });
        return { type: item, jobs };
    })));
    const workLevel = yield Promise.all(Object.values(job_1.ENUM_WORK_LEVEL).map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const jobs = yield model_1.default.countDocuments({ workLevel: item });
        return { type: item, jobs };
    })));
    return { employmentType, workLevel };
});
const getJob = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const data = yield model_1.default.findById(id).populate('company').lean();
    const email = (_b = (yield model_3.default.findOne({ id: data === null || data === void 0 ? void 0 : data.company.id }))) === null || _b === void 0 ? void 0 : _b.email;
    return Object.assign(Object.assign({}, data), { email });
});
const updateJob = (id, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const jobExist = yield model_1.default.isJobExist(id);
    if (!jobExist)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Job record not found');
    const companyId = (_c = (yield model_2.default.findOne({ id: userId }))) === null || _c === void 0 ? void 0 : _c._id;
    if (!companyId)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Company doesn't exist");
    if (!(yield model_1.default.isJobCreator(id, companyId)))
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "You didn't posted this job");
    const data = yield model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return data;
});
const deleteJob = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const jobExist = yield model_1.default.isJobExist(id);
    if (!jobExist)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Job record not found');
    const companyId = (_d = (yield model_2.default.findOne({ id: userId }))) === null || _d === void 0 ? void 0 : _d._id;
    if (!companyId)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Company doesn't exist");
    if (!(yield model_1.default.isJobCreator(id, companyId)))
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "You didn't posted this job");
    const data = yield model_1.default.findByIdAndDelete(id);
    return data;
});
exports.JobServices = {
    createJob,
    getAllJobs,
    getTypeSpecifiJobs,
    getJob,
    updateJob,
    deleteJob,
};
