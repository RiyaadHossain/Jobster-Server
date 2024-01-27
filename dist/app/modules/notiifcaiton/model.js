"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_1 = require("../../../enums/user");
const notification_1 = require("../../../enums/notification");
const notificationSchema = new mongoose_1.Schema({
    from: {
        _id: { type: mongoose_1.Schema.Types.ObjectId },
        name: String,
        role: { type: String, enum: Object.values(user_1.ENUM_USER_ROLE) },
    },
    to: {
        _id: { type: mongoose_1.Schema.Types.ObjectId },
        name: String,
        role: { type: String, enum: Object.values(user_1.ENUM_USER_ROLE) },
    },
    type: {
        type: String,
        enum: Object.values(notification_1.ENUM_NOFICATION_TYPE),
        required: true,
    },
    job: { _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job' }, title: String },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
const Notification = (0, mongoose_1.model)('Notification', notificationSchema);
exports.default = Notification;
