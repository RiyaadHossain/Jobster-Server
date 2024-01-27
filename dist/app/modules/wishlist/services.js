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
exports.WishlistServices = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const model_1 = __importDefault(require("../candidate/model"));
const http_status_1 = __importDefault(require("http-status"));
const model_2 = __importDefault(require("./model"));
const model_3 = __importDefault(require("../job/model"));
const add = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const candidate = yield model_1.default.findOne({ id: userId });
    if (!candidate)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Candidate account not found');
    const job = yield model_3.default.findById(payload.job);
    if (!job)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Job data not found');
    const isExist = yield model_2.default.findOne({
        candidate: candidate._id,
        job: job._id,
    });
    if (isExist)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Already added in wishlist');
    payload.candidate = candidate._id;
    const data = yield model_2.default.create(payload);
    return data;
});
const myList = (userId, searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const candidate = yield model_1.default.findOne({ id: userId });
    if (!candidate)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Candidate account not found');
    const data = yield model_2.default.find({
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
const alreadyAdded = (jobId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const candidate = yield model_1.default.findOne({ id: userId });
    if (!candidate)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Candidate account not found');
    const isAdded = yield model_2.default.findOne({
        candidate: candidate._id,
        job: jobId,
    });
    return !!isAdded;
});
const remove = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const candidate = yield model_1.default.findOne({ id: userId });
    if (!candidate)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Candidate account not found');
    const wishlist = yield model_2.default.findById(id);
    if (!wishlist)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Wishlist item not found');
    if (!wishlist.candidate.equals(candidate._id))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'This item is not included in your wishlist');
    const data = yield model_2.default.findByIdAndDelete(id);
    return data;
});
exports.WishlistServices = { add, myList, alreadyAdded, remove };
