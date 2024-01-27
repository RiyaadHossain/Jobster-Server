"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyValidations = void 0;
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
        companySize: zod_1.z.string().optional(),
        founded: zod_1.z.string().optional(),
        location: zod_1.z
            .enum([...Object.values(location_1.ENUM_LOCATION)])
            .optional(),
        industry: zod_1.z
            .enum([...Object.values(industry_1.ENUM_INDUSTRY)])
            .optional(),
        about: zod_1.z.string().optional(),
        galleries: zod_1.z.string().array().optional(),
        website: zod_1.z.string().optional(),
        socialLinks: zod_1.z
            .object({
            facebook: zod_1.z.string().optional(),
            twitter: zod_1.z.string().optional(),
            instagram: zod_1.z.string().optional(),
            linkedin: zod_1.z.string().optional(),
        })
            .optional(),
    }),
});
exports.CompanyValidations = { editProfile };
