"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleJWTError = (error) => {
    const type = 'TokenExpired';
    let statusCode = http_status_1.default.BAD_REQUEST;
    let message = 'Invalid Token';
    let errorMessages = [{ path: '', message: 'Invalid Token' }];
    if (error.name === 'TokenExpiredError') {
        statusCode = http_status_1.default.UNAUTHORIZED;
        message = 'Token is expired';
        errorMessages = [{ path: '', message: 'Token is expired' }];
    }
    return { type, statusCode, message, errorMessages };
};
exports.default = handleJWTError;
