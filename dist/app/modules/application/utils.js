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
exports.ApplicationUtils = void 0;
const model_1 = __importDefault(require("../candidate/model"));
const model_2 = __importDefault(require("../job/model"));
const isJobExist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield model_2.default.findById(id);
    return isExist;
});
const isCandidateExist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield model_1.default.findOne({ id });
    return isExist;
});
exports.ApplicationUtils = { isJobExist, isCandidateExist };
