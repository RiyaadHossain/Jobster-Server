"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const companySchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true, minlength: 3, maxlength: 16 },
    logo: { type: String },
    banner: { type: String },
    phoneNumber: { type: String },
    about: { type: String },
    founded: { type: String },
    companySize: { type: String },
    location: { type: String },
    website: { type: String },
    galleries: [{ type: String }],
    industry: { type: String },
    socialLinks: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String,
    },
});
const Company = (0, mongoose_1.model)('Company', companySchema);
exports.default = Company;
