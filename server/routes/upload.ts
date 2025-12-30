// ============================================
// UPLOAD API ROUTES - Image upload to Cloudinary
// ============================================

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer for temporary local storage
const uploadDir = path.join(process.cwd(), 'uploads', 'temp');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
        }
    },
});

// Configure Cloudinary (set these in environment variables)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// POST /api/upload/image - Upload image
router.post('/image', upload.single('image'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const { type = 'food' } = req.body; // 'food' or 'recipe'

        // Check if Cloudinary is configured
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: `diet-app/${type}s`,
                transformation: [
                    { width: 500, height: 500, crop: 'fill' },
                    { quality: 'auto' },
                    { format: 'webp' },
                ],
            });

            // Delete temp file
            fs.unlinkSync(req.file.path);

            res.json({
                success: true,
                url: result.secure_url,
                public_id: result.public_id,
            });
        } else {
            // Local storage fallback (for development)
            const permanentDir = path.join(process.cwd(), 'uploads', `${type}s`);
            if (!fs.existsSync(permanentDir)) {
                fs.mkdirSync(permanentDir, { recursive: true });
            }

            const permanentPath = path.join(permanentDir, req.file.filename);
            fs.renameSync(req.file.path, permanentPath);

            const localUrl = `/uploads/${type}s/${req.file.filename}`;

            res.json({
                success: true,
                url: localUrl,
                local: true,
            });
        }
    } catch (error) {
        console.error('Error uploading image:', error);

        // Clean up temp file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// DELETE /api/upload/image - Delete image from Cloudinary
router.delete('/image', async (req: Request, res: Response) => {
    try {
        const { public_id, url } = req.body;

        if (public_id && process.env.CLOUDINARY_CLOUD_NAME) {
            // Delete from Cloudinary
            await cloudinary.uploader.destroy(public_id);
            res.json({ success: true, message: 'Image deleted from Cloudinary' });
        } else if (url && url.startsWith('/uploads/')) {
            // Delete local file
            const filePath = path.join(process.cwd(), url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            res.json({ success: true, message: 'Image deleted locally' });
        } else {
            res.status(400).json({ error: 'public_id or local url is required' });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

export default router;
