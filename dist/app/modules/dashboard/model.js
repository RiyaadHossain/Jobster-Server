"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profileViewSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    viewedBy: { type: String, required: true },
    viewedAt: { type: Date, default: new Date() },
});
const ProfileView = (0, mongoose_1.model)('ProfileView', profileViewSchema);
exports.default = ProfileView;
