"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const candidateSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true, minlength: 3, maxlength: 16 },
    avatar: { type: String },
    banner: { type: String },
    about: { type: String },
    industry: { type: String },
    title: { type: String },
    location: { type: String },
    phoneNumber: { type: String },
    skills: [{ title: { type: String } }],
    resume: {
        fileName: { type: String },
        fileURL: { type: String },
    },
    workExperience: [
        {
            timePeriod: String,
            position: String,
            company: String,
            details: String,
        },
    ],
    educationTraining: [
        {
            timePeriod: String,
            courseName: String,
            institution: String,
            details: String,
        },
    ],
});
const Candidate = (0, mongoose_1.model)('Candidate', candidateSchema);
exports.default = Candidate;
