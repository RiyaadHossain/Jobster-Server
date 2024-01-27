"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const user_1 = require("../../../enums/user");
const zod_1 = require("zod");
const signUp = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.object({
            email: zod_1.z.string({ required_error: 'Email is required' }).email(),
            role: zod_1.z.enum([...Object.values(user_1.ENUM_USER_ROLE)]),
            password: zod_1.z
                .string({ required_error: 'Password is required' })
                .min(6)
                .max(32),
        }),
        name: zod_1.z.string({ required_error: 'Name is required' }),
    }),
});
exports.UserValidations = { signUp };
