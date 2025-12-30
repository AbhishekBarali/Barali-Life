// ============================================
// EXPRESS SERVER - Main entry point
// ============================================

import express from 'express';
import cors from 'cors';
import path from 'path';
import { initializeDatabase } from './db/database';

// Import routes
import foodsRouter from './routes/foods';
import recipesRouter from './routes/recipes';
import templatesRouter from './routes/templates';
import logsRouter from './routes/logs';
import settingsRouter from './routes/settings';
import alternativesRouter from './routes/alternatives';
import uploadRouter from './routes/upload';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Serve uploaded images (for local development)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API Routes
app.use('/api/foods', foodsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/logs', logsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/alternatives', alternativesRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Initialize database and start server
initializeDatabase();

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Database: data/diet.db`);
});

export default app;
