"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const makeFirstLetterUpperCase = (word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    return firstLetter + word.slice(1);
};
exports.Utils = { makeFirstLetterUpperCase };
