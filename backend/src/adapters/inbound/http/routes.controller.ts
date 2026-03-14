// File: backend/src/adapters/inbound/http/routes.controller.ts

import { Request, Response, Router } from 'express';
// Fixed paths: Going up 2 levels (http -> inbound -> adapters) then into outbound
import { RouteRepository } from '../../outbound/postgres/RouteRepository';
// Fixed paths: Going up 3 levels (http -> inbound -> adapters -> src) then into core
import { FuelEUConstants } from '../../../core/domain/FuelEUConstants';

const router = Router();
const routeRepo = new RouteRepository();

// GET /api/routes -> List all routes
router.get('/', async (req: Request, res: Response) => {
    try {
        const routes = await routeRepo.findAll();
        res.json(routes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/routes/:id/baseline -> Set baseline route
router.post('/:id/baseline', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await routeRepo.setBaseline(id);
        res.json({ message: `Route ${id} successfully set as baseline.` });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/routes/comparison -> Compare routes vs baseline
router.get('/comparison', async (req: Request, res: Response) => {
    try {
        const routes = await routeRepo.findAll();
        const baseline = await routeRepo.getBaseline();

        if (!baseline) {
            return res.status(400).json({ error: "No baseline route is currently set." });
        }

        const comparison = routes.map(route => {
            // Formula: ((comparison / baseline) - 1) * 100
            const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
            const compliant = route.ghgIntensity <= FuelEUConstants.TARGET_INTENSITY_2025;

            return {
                ...route,
                percentDiff,
                compliant
            };
        });

        res.json({ baseline, comparison });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;