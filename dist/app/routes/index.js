"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("../modules/auth/routes");
const routes_2 = require("../modules/user/routes");
const routes_3 = require("../modules/company/routes");
const routes_4 = require("../modules/candidate/routes");
const routes_5 = require("../modules/job/routes");
const routes_6 = require("../modules/application/routes");
const routes_7 = require("../modules/wishlist/routes");
const routes_8 = require("../modules/notiifcaiton/routes");
const routes_9 = require("../modules/dashboard/routes");
const routes_10 = require("../modules/industry/routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        routes: routes_1.AuthRoutes,
    },
    {
        path: '/user',
        routes: routes_2.UserRoutes,
    },
    {
        path: '/company',
        routes: routes_3.CompanyRoutes,
    },
    {
        path: '/candidate',
        routes: routes_4.CandidateRoutes,
    },
    {
        path: '/job',
        routes: routes_5.JobRoutes,
    },
    {
        path: '/industry',
        routes: routes_10.IndustryRoutes,
    },
    {
        path: '/application',
        routes: routes_6.ApplicationRoutes,
    },
    {
        path: '/wishlist',
        routes: routes_7.WishlistRoutes,
    },
    {
        path: '/notification',
        routes: routes_8.NotificationRoutes,
    },
    {
        path: '/dashboard',
        routes: routes_9.DashboardRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.routes));
exports.default = router;
