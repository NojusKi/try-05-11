"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_js_1 = __importDefault(require("../config/database.js"));
const zod_1 = require("zod");
const auth_js_1 = require("./auth.js");
const checkRole_js_1 = require("../middleware/checkRole.js");
const router = express_1.default.Router();
// Pet validation schema
const petSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Pet name is required"),
    type: zod_1.z.string().min(1, "Pet type is required"),
    breed: zod_1.z.string().optional(),
    age: zod_1.z.number().min(0, "Age needs to be a positive number"),
    gender: zod_1.z.string().optional(),
    size: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    image_url: zod_1.z.string().optional()
});
// Get all pets
router.get('/', async (_req, res) => {
    try {
        const [pets] = await database_js_1.default.execute(`SELECT p.*, 
            COALESCE(
              (SELECT COUNT(*) 
               FROM adoption_requests ar 
               WHERE ar.pet_id = p.id AND ar.status = 'pending'), 
              0
            ) as pending_requests
           FROM pets p 
           ORDER BY p.created_at DESC`);
        res.json({
            success: true,
            data: pets
        });
    }
    catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching pets'
        });
    }
});
// Add new pet (admin only permission)
router.post('/', auth_js_1.authenticateToken, (0, checkRole_js_1.checkRole)(['admin']), async (req, res) => {
    try {
        console.log('Received pet data:', req.body); // Debug log
        const petData = petSchema.parse(req.body);
        console.log('Validated pet data:', petData); // Debug log
        const [_result] = await database_js_1.default.execute(`INSERT INTO pets (
                name, type, breed, age, gender, size, description, image_url, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'available')`, [
            petData.name,
            petData.type,
            petData.breed || null,
            petData.age || null,
            petData.gender || null,
            petData.size || null,
            petData.description || null,
            petData.image_url || null
        ]);
        res.status(201).json({
            success: true,
            message: 'Pet added successfully'
        });
    }
    catch (error) {
        console.error('Error adding pet:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors
            });
        }
        res.status(500).json({
            success: false,
            error: 'Error adding pet'
        });
    }
});
// Get specific pet 
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [pets] = await database_js_1.default.execute('SELECT * FROM pets WHERE id = ?', [id]);
        if (!pets.length) {
            return res.status(404).json({
                success: false,
                error: 'Pet not found'
            });
        }
        res.json({
            success: true,
            data: pets[0]
        });
    }
    catch (error) {
        console.error('Error fetching pet:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching pet'
        });
    }
});
// Update pet (admin only)
router.put('/:id', auth_js_1.authenticateToken, (0, checkRole_js_1.checkRole)(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const petData = petSchema.parse(req.body);
        await database_js_1.default.execute(`UPDATE pets SET
            name = ?, type = ?, breed = ?, age = ?, gender = ?,
            size = ?, description = ?, image_url = ?
            WHERE id = ?`, [
            petData.name,
            petData.type,
            petData.breed || null,
            petData.age || null,
            petData.gender || null,
            petData.size || null,
            petData.description || null,
            petData.image_url || null,
            id
        ]);
        res.json({
            success: true,
            message: 'Pet updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating pet:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors
            });
        }
        res.status(500).json({
            success: false,
            error: 'Error updating pet'
        });
    }
});
// Delete pet (admin only)
router.delete('/:id', auth_js_1.authenticateToken, (0, checkRole_js_1.checkRole)(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await database_js_1.default.execute('DELETE FROM pets WHERE id = ?', [id]);
        res.json({
            success: true,
            message: 'Pet deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting pet:', error);
        res.status(500).json({
            success: false,
            error: 'Error deleting pet'
        });
    }
});
exports.default = router;
