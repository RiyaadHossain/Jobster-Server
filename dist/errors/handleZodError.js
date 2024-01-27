"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    let statusCode = 400;
    let message = 'Validation Error';
    let type = '';
    const errors = error.issues.map((issue) => {
        return {
            path: issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1],
            message: issue === null || issue === void 0 ? void 0 : issue.message,
        };
    });
    const isRefreshTokenErr = errors.find(error => error.path === 'refreshToken');
    if (isRefreshTokenErr) {
        statusCode = 401;
        message = 'Refresh Token is required';
        type = 'TokenExpired';
    }
    return {
        statusCode,
        message,
        type,
        errorMessages: errors,
    };
};
exports.default = handleZodError;
