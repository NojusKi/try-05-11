"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const pets_js_1 = __importDefault(require("./routes/pets.js"));
const adoptions_js_1 = __importDefault(require("./routes/adoptions.js"));
const contact_js_1 = __importDefault(require("./routes/contact.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use((0, helmet_1.default)());
app.use((0, xss_clean_1.default)());
if (process.env.NODE_ENV !== 'development') {
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100
    }));
}
//body parser with limit
app.use(express_1.default.json({ limit: '10kb' }));
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// routes
app.use('/api/auth', auth_js_1.default);
app.use('/api/pets', pets_js_1.default);
app.use('/api/adoptions', adoptions_js_1.default);
app.use('/api/contact', contact_js_1.default);
//gkobal error handling
app.use((err, _req, res, _next) => {
    console.error('Error:', err.stack);
    const errorResponse = {
        status: 'error',
        message: err.message || "internal server error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
    res.status(err.status || 500).json(errorResponse);
});
//unhandled routes
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Cannot find ${req.originalUrl} on this server!`,
    });
});
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection!');
    console.error(err.name, err.message);
    process.exit(1);
});
