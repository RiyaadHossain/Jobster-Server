"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploader = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.CLOUDINARY.CLOUD_NAME,
    api_key: config_1.default.CLOUDINARY.API_KEY,
    api_secret: config_1.default.CLOUDINARY.API_SECRET,
});
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
const uploadToCloudinary = (file, fileType) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(file === null || file === void 0 ? void 0 : file.mimetype.includes(fileType))) {
        (0, fs_1.unlinkSync)(file.path);
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `File type must be ${fileType}`);
    }
    const result = yield cloudinary_1.v2.uploader.upload(file.path);
    (0, fs_1.unlinkSync)(file.path);
    return result;
});
exports.FileUploader = {
    upload,
    uploadToCloudinary,
};
