"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const zod_1 = require("zod");
const signIn = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }).email(),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const accessToken = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: 'Refresh Token is required' }),
    }),
});
const changePassword = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({ required_error: 'Old Password is required' }),
        newPassword: zod_1.z
            .string({ required_error: 'New Password is required' })
            .min(6)
            .max(32),
    }),
});
const forgetPassword = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email('Must be an email'),
    }),
});
const resetPassword = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string({ required_error: 'Token is Invalid' }),
        newPassword: zod_1.z
            .string({ required_error: 'New Password is required' })
            .min(6)
            .max(32),
    }),
});
exports.AuthValidations = {
    signIn,
    accessToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
