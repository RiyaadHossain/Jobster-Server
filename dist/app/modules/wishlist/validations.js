"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistValidations = void 0;
const zod_1 = require("zod");
const add = zod_1.z.object({
    body: zod_1.z.object({
        job: zod_1.z.string({ required_error: 'Job Id is required' }),
    }),
});
exports.WishlistValidations = { add };
