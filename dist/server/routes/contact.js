"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
// contact form validation schma
const contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be atleast 2 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    subject: zod_1.z.string().min(2, "Subject must be atleast 2 characters"),
    message: zod_1.z.string().min(10, "Message must be atleast 10 characters")
});
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    try {
        // incoming data validation
        contactSchema.parse(req.body);
        // email is just returned without sending 
        res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors
            });
        }
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while sending the message'
        });
    }
});
exports.default = router;
