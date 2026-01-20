const express = require('express');
const helmet = require('helmet');
const app = express();

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "style-src": ["'self'", "'unsafe-inline'"],
        },
    },
}));

const sanitize = (str) => {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
};

app.get('/', (req, res) => {
    const defaultName = (ENV === 'production') ? 'User' : 'Dev';
    res.redirect(`/hello/${defaultName}`);
});

app.get('/hello/:name', (req, res) => {
    const cleanName = sanitize(req.params.name);
    const statusColor = ENV === 'production' ? '#27ae60' : '#f39c12';

    res.status(200).send(`
        <!DOCTYPE html>
        <html>
            <body style="font-family: sans-serif; text-align: center;">
                <h1 style="color: #2c3e50;">Hello, ${cleanName}!</h1>
                <p>Environment: <strong style="color: ${statusColor};">${ENV}</strong></p>
            </body>
        </html>
    `);
});

// Important for Testing: Only listen if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

module.exports = app; // Export for Jest