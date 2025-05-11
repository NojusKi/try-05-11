"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_js_1 = __importDefault(require("../config/database.js"));
const zod_1 = require("zod");
const router = express_1.default.Router();
const registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['user', 'admin']).default('user'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
const profileUpdateSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    currentPassword: zod_1.z.string(),
    newPassword: zod_1.z.string().min(6).optional(),
    preferences: zod_1.z.object({
        notifications: zod_1.z.boolean(),
        newsletter: zod_1.z.boolean()
    }).optional()
});
// verify JWT token (middleware)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, role } = registerSchema.parse(req.body);
        // Check if email already exists
        const [existingUsers] = await database_js_1.default.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await database_js_1.default.execute('INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)', [fullName, email, hashedPassword, role || 'user']);
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: "Error registering user" });
    }
});
//login user 
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const [users] = await database_js_1.default.execute('SELECT id, email, full_name, password, role FROM users WHERE email = ?', [email]);
        if (!users.length) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = users[0];
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '48h' });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});
//getting user profile
router.get('/profile', exports.authenticateToken, async (req, res) => {
    try {
        const [users] = await database_js_1.default.execute('SELECT id, full_name, email, role, created_at FROM users WHERE id = ?', [req.user.userId]);
        if (!users.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            success: true,
            data: users[0]
        });
    }
    catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
});
// user profile update
router.put('/profile', exports.authenticateToken, async (req, res) => {
    try {
        const { fullName, email, currentPassword, newPassword, preferences } = profileUpdateSchema.parse(req.body);
        //verifying the current password
        const [users] = await database_js_1.default.execute('SELECT * FROM users WHERE id = ?', [req.user.userId]);
        if (!users.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        const validPassword = await bcryptjs_1.default.compare(currentPassword, users[0].password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }
        //update users information
        const updates = {};
        if (fullName)
            updates.full_name = fullName;
        if (email)
            updates.email = email;
        if (newPassword)
            updates.password = await bcryptjs_1.default.hash(newPassword, 10);
        if (preferences)
            updates.preferences = JSON.stringify(preferences);
        if (Object.keys(updates).length > 0) {
            const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(updates), req.user.userId];
            await database_js_1.default.execute(`UPDATE users SET ${setClauses} WHERE id = ?`, values);
        }
        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
});
exports.default = router;
