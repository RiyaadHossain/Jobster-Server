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
exports.CompanyServices = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const http_status_1 = __importDefault(require("http-status"));
const model_1 = __importDefault(require("../user/model"));
const constant_1 = require("./constant");
const model_2 = __importDefault(require("./model"));
const model_3 = __importDefault(require("../job/model"));
const model_4 = __importDefault(require("../application/model"));
const utils_1 = require("../candidate/utils");
const getAllCompanies = (pagination, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortOrder, sortBy } = paginationHelper_1.paginationHelpers.calculatePagination(pagination);
    // Sort condition
    const sortCondition = {};
    sortCondition[sortBy] = sortOrder;
    // Filter Options
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: constant_1.filterAbleFields.map(field => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: { $regex: value, $options: 'i' },
            })),
        });
    }
    const whereCondition = andConditions.length ? { $and: andConditions } : {};
    let compnaies = yield model_2.default.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit)
        .lean();
    compnaies = yield Promise.all(compnaies.map((company) => __awaiter(void 0, void 0, void 0, function* () {
        const jobs = yield model_3.default.countDocuments({ company: company._id });
        return Object.assign(Object.assign({}, company), { jobs });
    })));
    const total = yield model_2.default.countDocuments(whereCondition);
    const totalPages = Math.ceil(total / limit);
    const meta = { total, page, limit, totalPages };
    return { meta, data: compnaies };
});
const getCompany = (id, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const company = yield model_2.default.findById(id).lean();
    if (!company)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Company account doesn't exist");
    const email = (_a = (yield model_1.default.findOne({ id: company.id }))) === null || _a === void 0 ? void 0 : _a.email;
    company.email = email;
    utils_1.CandidateUtils.countProfileView(authUser, company);
    const availableJobs = yield model_3.default.find({ company: id });
    return { company, availableJobs };
});
const editProfile = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield model_1.default.isUserExist(userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Company account is not exist!');
    const updatedData = yield model_2.default.findByIdAndUpdate(user.company, payload, {
        new: true,
        runValidators: true,
    });
    return updatedData;
});
const myJobs = (userId, searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield model_2.default.findOne({ id: userId });
    if (!company)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Company account is not exist!');
    const query = { company: company._id };
    if (searchTerm)
        query['title'] = { $regex: searchTerm, $options: 'i' };
    const jobs = yield model_3.default.find(query);
    // Create an array to store job details along with applications' ids
    const jobsWithApplications = yield Promise.all(jobs.map((job) => __awaiter(void 0, void 0, void 0, function* () {
        const applications = yield model_4.default.find({
            job: job._id,
        });
        const applicationIds = applications.map(application => application._id);
        return {
            job: job.toObject(),
            applications: applicationIds,
        };
    })));
    return jobsWithApplications;
});
const appliedCandidates = (userId, searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield model_2.default.findOne({ id: userId });
    if (!company)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Company account is not exist!');
    const jobs = yield model_3.default.find({ company: company._id });
    const jobIds = jobs.map(job => job._id);
    const data = yield model_4.default.find({
        job: { $in: jobIds },
    }).populate([
        { path: 'job', select: '_id title industry location' },
        { path: 'candidate', select: '_id name avatar location industry' },
    ]);
    let filteredData = data;
    if (searchTerm)
        filteredData = data.filter(item => {
            var _a, _b, _c, _d;
            searchTerm = searchTerm === null || searchTerm === void 0 ? void 0 : searchTerm.toLowerCase();
            const jobTitle = (_b = (_a = item === null || item === void 0 ? void 0 : item.job) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            const companyName = (_d = (_c = item === null || item === void 0 ? void 0 : item.candidate) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.toLowerCase();
            // @ts-ignore
            return jobTitle.includes(searchTerm) || companyName.includes(searchTerm);
        });
    return filteredData;
});
exports.CompanyServices = {
    getAllCompanies,
    getCompany,
    editProfile,
    myJobs,
    appliedCandidates,
};
