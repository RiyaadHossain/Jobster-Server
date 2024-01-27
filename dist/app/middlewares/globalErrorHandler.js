"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const handleValidationError_1 = __importDefault(require("../../errors/handleValidationError"));
const handleCastError_1 = __importDefault(require("../../errors/handleCastError"));
const handleZodError_1 = __importDefault(require("../../errors/handleZodError"));
const zod_1 = require("zod");
const handleJWTError_1 = __importDefault(require("../../errors/handleJWTError"));
const multer_1 = __importDefault(require("multer"));
const globalErrorHandler = (error, req, res, next) => {
    config_1.default.ENV === 'development'
        ? console.log(`🐱 globalErrorHandler ~~`, { error })
        : console.log(`🐱 globalErrorHandler ~~`, error);
    let type = '';
    let statusCode = 500;
    let message = 'Something went wrong !';
    let errorMessages = [];
    if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
        const simplifiedError = (0, handleValidationError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        type = simplifiedError.type;
        errorMessages = simplifiedError.errorMessages;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === 'CastError') {
        const simplifiedError = (0, handleCastError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof multer_1.default.MulterError) {
        statusCode = 400;
        message = 'An error occured while uploading file';
        errorMessages = [{ path: '', message: 'Error while uploading file' }];
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === 'JsonWebTokenError' ||
        (error === null || error === void 0 ? void 0 : error.name) === 'TokenExpiredError') {
        const simplifiedError = (0, handleJWTError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        type = simplifiedError.type;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof ApiError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    else if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    res.status(statusCode).json({
        success: false,
        type,
        message,
        errorMessages,
        stack: config_1.default.ENV !== 'production' ? error === null || error === void 0 ? void 0 : error.stack : undefined,
    });
};
exports.default = globalErrorHandler;
