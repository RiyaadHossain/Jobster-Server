"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const application_1 = require("../../../enums/application");
const applicationSchema = new mongoose_1.Schema({
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidate: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(application_1.ENUM_APPLICATION_STATUS),
        default: application_1.ENUM_APPLICATION_STATUS.PENDING,
    },
}, { timestamps: true });
const Application = (0, mongoose_1.model)('Application', applicationSchema);
exports.default = Application;
