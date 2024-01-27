"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobValidations = void 0;
const industry_1 = require("../../../enums/industry");
const job_1 = require("../../../enums/job");
const location_1 = require("../../../enums/location");
const zod_1 = require("zod");
const createJob = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is Required' }),
        industry: zod_1.z.enum([...Object.values(industry_1.ENUM_INDUSTRY)]),
        description: zod_1.z.string({ required_error: 'Description is Required' }),
        location: zod_1.z.enum([...Object.values(location_1.ENUM_LOCATION)]),
        status: zod_1.z
            .enum([...Object.values(job_1.ENUM_JOB_STATUS)])
            .optional(),
        experience: zod_1.z.string({ required_error: 'Experience is Required' }),
        workLevel: zod_1.z.enum([...Object.values(job_1.ENUM_WORK_LEVEL)]),
        employmentType: zod_1.z.enum([...Object.values(job_1.ENUM_EMPLOYMENT_TYPE)]),
        salaryRange: zod_1.z.string({ required_error: 'Salary Range is Required' }),
        skills: zod_1.z.object({ title: zod_1.z.string() }).array().optional(),
        requirements: zod_1.z.object({ title: zod_1.z.string() }).array().optional(),
        responsibilities: zod_1.z.object({ title: zod_1.z.string() }).array().optional(),
    }),
});
const updateJob = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        industry: zod_1.z
            .enum([...Object.values(industry_1.ENUM_INDUSTRY)])
            .optional(),
        description: zod_1.z.string().optional(),
        experience: zod_1.z.string().optional(),
        workLevel: zod_1.z
            .enum([...Object.values(job_1.ENUM_WORK_LEVEL)])
            .optional(),
        status: zod_1.z
            .enum([...Object.values(job_1.ENUM_JOB_STATUS)])
            .optional(),
        employmentType: zod_1.z
            .enum([...Object.values(job_1.ENUM_EMPLOYMENT_TYPE)])
            .optional(),
        salaryRange: zod_1.z.string().optional(),
        skills: zod_1.z.object({ title: zod_1.z.string() }).array().optional(),
        requirements: zod_1.z.object({ title: zod_1.z.string() }).array().optional(),
        responsibilities: zod_1.z.object({ title: zod_1.z.string() }).array().optional(),
    }),
});
exports.JobValidations = { createJob, updateJob };
