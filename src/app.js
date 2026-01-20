const express = require('express');
const helmet = require('helmet');
const app = express();

// 1. IMPROVED INTENTIONALITY: Centralized environment configuration
const isProd = process.env.NODE_ENV === 'production';
const DEFAULT_NAME = isProd ? 'User' : 'Dev';
const STATUS_COLOR = isProd ? '#27ae60' : '#f39c12';

/* istanbul ignore next */
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            // 2. SECURITY INTENT: Consider moving styles to a CSS file 
            // to remove "'unsafe-inline'" and satisfy strict CSP requirements.
            "style-src": ["'self'", "'unsafe-inline'"],
        },
    },
}));

// 3. IMPROVED INTENTIONALITY: Explicit input handling using default parameters
const sanitize = (str = '') => {
    // Ensuring the input is treated as a string intentionally
    return str.toString().replace(/[&<>"']/g, (m) => {
        const map = { 
            '&': '&amp;', 
            '<': '&lt;', 
            '>': '&gt;', 
            '"': '&quot;', 
            "'": '&#39;' 
        };
        return map[m];
    });
};

app.get('/', (req, res) => {
    // 4. LOGICAL INTENT: Removed redundant if/else check in favor of a clear variable
    res.redirect(`/hello/${DEFAULT_NAME}`);
});

app.get('/hello/:name', (req, res) => {
    const cleanName = sanitize(req.params.name);
    
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>App</title>
            </head>
            <body style="font-family: sans-serif; text-align: center;">
                <h1>Hello, ${cleanName}!</h1>
                <p>Environment: <strong>${process.env.NODE_ENV || 'development'}</strong></p>
                <div style="background: ${STATUS_COLOR}; color: white; padding: 10px; display: inline-block; border-radius: 5px;">
                    Status: Active
                </div>
            </body>
        </html>
    `);
});

module.exports = app;