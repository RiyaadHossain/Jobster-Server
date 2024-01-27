"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const wishlistSchema = new mongoose_1.Schema({
    candidate: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job', required: true },
}, { timestamps: true });
const Wishlist = (0, mongoose_1.model)('Wishlist', wishlistSchema);
exports.default = Wishlist;
