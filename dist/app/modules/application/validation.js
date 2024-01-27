"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationValidations = void 0;
const application_1 = require("../../../enums/application");
const zod_1 = require("zod");
const apply = zod_1.z.object({
    body: zod_1.z.object({
        job: zod_1.z.string({ required_error: 'Job Id is required' }),
    }),
});
const updateStatus = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(Object.values(application_1.ENUM_APPLICATION_STATUS)),
    }),
});
exports.ApplicationValidations = { apply, updateStatus };
