// File: backend/src/infrastructure/server/main.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Corrected Paths: Go up 2 levels (server -> infrastructure -> src)
// then down into adapters
import routesController from '../../adapters/inbound/http/routes.controller';
import complianceController from '../../adapters/inbound/http/compliance.controller';

dotenv.config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// API Routes
app.use('/api/routes', routesController);
app.use('/api', complianceController);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`\n🚀 ============================================`);
  console.log(`✅ FuelEU Backend successfully running!`);
  console.log(`📡 URL: http://127.0.0.1:${PORT}`);
  console.log(`============================================\n`);
});