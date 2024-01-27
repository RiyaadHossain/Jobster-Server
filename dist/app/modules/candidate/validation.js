"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateValidations = void 0;
const industry_1 = require("../../../enums/industry");
const location_1 = require("../../../enums/location");
const zod_1 = require("zod");
const editProfile = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        profileView: zod_1.z.string().optional(),
        logo: zod_1.z.string().optional(),
        banner: zod_1.z.string().optional(),
        phoneNumber: zod_1.z.string().optional(),
        location: zod_1.z
            .enum([...Object.values(location_1.ENUM_LOCATION)])
            .optional(),
        industry: zod_1.z
            .enum([...Object.values(industry_1.ENUM_INDUSTRY)])
            .optional(),
        title: zod_1.z.string().optional(),
        about: zod_1.z.string().optional(),
        skills: zod_1.z.object({ title: zod_1.z.string() }).array().optional(),
        workExperience: zod_1.z
            .object({
            timePeriod: zod_1.z.string(),
            position: zod_1.z.string(),
            company: zod_1.z.string(),
            details: zod_1.z.string(),
        })
            .array()
            .optional(),
    }),
    educationTraining: zod_1.z
        .object({
        timePeriod: zod_1.z.string(),
        degreeName: zod_1.z.string(),
        institution: zod_1.z.string(),
        details: zod_1.z.string(),
    })
        .array()
        .optional(),
});
exports.CandidateValidations = { editProfile };
