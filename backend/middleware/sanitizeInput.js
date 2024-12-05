import mongoose from 'mongoose';
import xss from 'xss';

export const sanitizeInput = (req, res, next) => {
    // Sanitize body
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key].trim());
            }
        }
    }

    // Sanitize query parameters
    if (req.query) {
        for (let key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = xss(req.query[key].trim());
            }
        }
    }

    // Sanitize MongoDB IDs in params
    if (req.params) {
        for (let key in req.params) {
            if (typeof req.params[key] === 'string' && mongoose.Types.ObjectId.isValid(req.params[key])) {
                req.params[key] = new mongoose.Types.ObjectId(req.params[key]);
            }
        }
    }

    next();
};
