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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jwt = require('jsonwebtoken');
require('dotenv').config();
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { authorization } = req.headers;
            // console.log('authorization', authorization)
            const token = authorization.split(' ')[1];
            console.log('token', token);
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
                if (err) {
                    throw err;
                }
                res.locals.id = data.id;
                next();
            });
        }
        catch (err) {
            res.status(401).json({ message: 'Unauthorized' });
        }
    });
}
module.exports = { verifyToken };
