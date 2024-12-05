import rateLimit from 'express-rate-limit';

// Auth routes limiter (login, register, etc.)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

// API routes limiter (general requests)
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Post creation limiter
export const postLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 posts per hour
    message: 'Post limit reached. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Comment limiter
export const commentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 30 comments per 15 minutes
    message: 'Comment limit reached. Please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Exhibition creation limiter
export const exhibitionLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 5, // 5 exhibitions per day
    message: 'Exhibition creation limit reached. Please try again tomorrow.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Profile update limiter
export const profileLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 profile updates per hour
    message: 'Too many profile updates. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
