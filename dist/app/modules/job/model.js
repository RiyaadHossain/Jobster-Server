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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const job_1 = require("../../../enums/job");
const jobSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true },
    company: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true },
    location: { type: String },
    industry: { type: String, required: true },
    description: { type: String, required: true },
    salaryRange: { type: String, required: true },
    experience: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(job_1.ENUM_JOB_STATUS),
        default: job_1.ENUM_JOB_STATUS.PUBLISHED,
    },
    workLevel: {
        type: String,
        enum: Object.values(job_1.ENUM_WORK_LEVEL),
        required: true,
    },
    employmentType: {
        type: String,
        enum: Object.values(job_1.ENUM_EMPLOYMENT_TYPE),
        required: true,
    },
    skills: [{ title: { type: String } }],
    requirements: [{ title: { type: String } }],
    responsibilities: [{ title: { type: String } }],
}, { timestamps: true });
jobSchema.statics.isJobExist = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = yield Job.findById(id);
        return isExist;
    });
};
jobSchema.statics.isJobCreator = function (jobId, companyId) {
    return __awaiter(this, void 0, void 0, function* () {
        const job = yield Job.findById(jobId);
        return job === null || job === void 0 ? void 0 : job.company.equals(companyId);
    });
};
const Job = (0, mongoose_1.model)('Job', jobSchema);
exports.default = Job;
