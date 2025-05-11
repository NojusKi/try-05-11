"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_js_1 = __importDefault(require("../config/database.js"));
const zod_1 = require("zod");
const auth_js_1 = require("./auth.js");
const router = express_1.default.Router();
// Validation schema for adoption requests
const adoptionSchema = zod_1.z.object({
    petId: zod_1.z.number(),
    userId: zod_1.z.number(),
    fullName: zod_1.z.string().min(2, "Full name is required"),
    email: zod_1.z.string().email("Valid email is required"),
    address: zod_1.z.string().min(5, "Address is required"),
    experience: zod_1.z.string().optional(),
    reason: zod_1.z.string().min(10, "Please provide a detailed reason for adoption")
});
// Submit adoption request
router.post('/', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const adoptionData = adoptionSchema.parse(req.body);
        // Verify user is requesting for themselves
        if (req.user.userId !== adoptionData.userId) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized to submit adoption request for another user'
            });
        }
        // Check if pet is still available
        const [pets] = await database_js_1.default.execute('SELECT status FROM pets WHERE id = ?', [adoptionData.petId]);
        if (!pets.length || pets[0].status !== 'available') {
            return res.status(400).json({
                success: false,
                error: 'Pet is no longer available for adoption'
            });
        }
        // Start transaction
        const connection = await database_js_1.default.getConnection();
        await connection.beginTransaction();
        try {
            // Create adoption request
            await connection.execute('INSERT INTO adoption_requests (pet_id, user_id, message, status) VALUES (?, ?, ?, "pending")', [adoptionData.petId, adoptionData.userId, adoptionData.reason]);
            // Update pet status
            await connection.execute('UPDATE pets SET status = "pending" WHERE id = ?', [adoptionData.petId]);
            await connection.commit();
            res.status(201).json({
                success: true,
                message: 'Adoption request submitted successfully'
            });
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors
            });
        }
        console.error('Error submitting adoption request:', error);
        res.status(500).json({
            success: false,
            error: 'Error submitting adoption request'
        });
    }
});
// Get user's adoption requests
router.get('/user/:userId', auth_js_1.authenticateToken, async (req, res) => {
    try {
        // Verify user is requesting their own adoptions
        if (req.user.userId !== parseInt(req.params.userId)) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized to view another user\'s adoption requests'
            });
        }
        //fetching the adoption requests from the database
        const [requests] = await database_js_1.default.execute(`SELECT ar.*, p.name as pet_name, p.image_url, p.breed, p.age, p.type 
       FROM adoption_requests ar 
       JOIN pets p ON ar.pet_id = p.id 
       WHERE ar.user_id = ?
       ORDER BY ar.created_at DESC`, [req.params.userId]);
        res.json({
            success: true,
            data: requests
        });
    }
    catch (error) {
        console.error('Error fetching adoption requests:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching adoption requests'
        });
    }
});
exports.default = router;
