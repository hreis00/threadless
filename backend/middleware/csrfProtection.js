import csrf from 'csurf';

// Create CSRF protection middleware
export const csrfProtection = csrf({
    cookie: {
        key: '_csrf',
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600 // 1 hour
    }
});

// Error handler for CSRF token validation
export const handleCSRFError = (err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    }

    // Handle CSRF token validation errors
    res.status(403).json({
        error: 'Invalid or missing CSRF token. Please refresh the page and try again.'
    });
};
