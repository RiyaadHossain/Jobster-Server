"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRoutes = void 0;
const auth_1 = __importDefault(require("../../../app/middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../app/middlewares/validateRequest"));
const user_1 = require("../../../enums/user");
const express_1 = __importDefault(require("express"));
const validations_1 = require("./validations");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.post('/add', (0, auth_1.default)([user_1.ENUM_USER_ROLE.CANDIDATE]), (0, validateRequest_1.default)(validations_1.WishlistValidations.add), controller_1.WishlistControllers.add);
router.get('/my-list', (0, auth_1.default)([user_1.ENUM_USER_ROLE.CANDIDATE]), controller_1.WishlistControllers.myList);
router.get('/already-added/:id', (0, auth_1.default)([user_1.ENUM_USER_ROLE.CANDIDATE]), controller_1.WishlistControllers.alreadyAdded);
router.delete('/remove/:id', (0, auth_1.default)([user_1.ENUM_USER_ROLE.CANDIDATE]), controller_1.WishlistControllers.remove);
exports.WishlistRoutes = router;
