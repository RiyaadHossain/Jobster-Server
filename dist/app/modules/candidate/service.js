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
exports.CandidateServices = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const http_status_1 = __importDefault(require("http-status"));
const model_1 = __importDefault(require("../user/model"));
const constant_1 = require("./constant");
const model_2 = __importDefault(require("./model"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const file_1 = require("../../../enums/file");
const utils_1 = require("./utils");
const getAllCandidates = (pagination, filters) => __awaiter(void 0, void 0, void 0, function* () {
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
    const Candidates = yield model_2.default.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const total = yield model_2.default.countDocuments(whereCondition);
    const totalPages = Math.ceil(total / limit);
    const meta = { total, page, limit, totalPages };
    return { meta, data: Candidates };
});
const getCandidate = (id, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const candidate = yield model_2.default.findById(id);
    if (!candidate)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Candidate account doesn't exist");
    const email = (_a = (yield model_1.default.findOne({ id: candidate.id }))) === null || _a === void 0 ? void 0 : _a.email;
    if (authUser)
        utils_1.CandidateUtils.countProfileView(authUser, candidate);
    // @ts-ignore
    return Object.assign(Object.assign({}, candidate._doc), { email });
});
const editProfile = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield model_1.default.isUserExist(userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Candidate account is not exist!');
    const updatedData = yield model_2.default.findByIdAndUpdate(user.candidate, payload, {
        new: true,
        runValidators: true,
    });
    console.log(user, updatedData);
    return updatedData;
});
const uploadResume = (userId, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Must be uploaded a resume');
    const uploadedResume = yield fileUploader_1.FileUploader.uploadToCloudinary(file, file_1.ENUM_FILE_TYPE.PDF);
    // 1. Check Candidate account exist
    const candidate = yield model_2.default.findOne({ id: userId });
    if (!candidate)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Candidate account doesn't exist!");
    // 2. Save fileName and fileURL
    candidate.resume = {
        fileName: file.originalname,
        fileURL: uploadedResume.secure_url,
    };
    yield candidate.save();
});
const deleteResume = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const candidate = yield model_2.default.findOne({ id: userId });
    if (!candidate)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Candidate account doesn't exist!");
    candidate.resume = undefined;
    yield candidate.save();
});
exports.CandidateServices = {
    getAllCandidates,
    getCandidate,
    editProfile,
    uploadResume,
    deleteResume,
};
