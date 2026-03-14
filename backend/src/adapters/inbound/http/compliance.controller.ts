// File: backend/src/adapters/inbound/http/compliance.controller.ts

import { Request, Response, Router } from 'express';
// We need ../../ to go from http -> inbound -> adapters
import { RouteRepository } from '../../outbound/postgres/RouteRepository';
import { ComplianceRepository } from '../../outbound/postgres/ComplianceRepository';
// We need ../../../ to go from http -> inbound -> adapters -> src
import { ComplianceCalculator } from '../../../core/domain/ComplianceCalculator';
import { PoolingService } from '../../../core/application/PoolingService';

const router = Router();
const routeRepo = new RouteRepository();
const complianceRepo = new ComplianceRepository();

// GET /api/compliance/cb?routeId=R001
router.get('/compliance/cb', async (req: Request, res: Response) => {
    const routeId = req.query.routeId as string;
    const route = await routeRepo.findById(routeId);

    if (!route) return res.status(404).json({ error: "Route not found" });

    const cb = ComplianceCalculator.calculateCB(route.ghgIntensity, route.fuelConsumption);
    res.json({ routeId, cb, status: cb >= 0 ? 'Surplus' : 'Deficit' });
});

// POST /api/banking/bank -> Bank surplus CB
router.post('/banking/bank', async (req: Request, res: Response) => {
    const { shipId, year, amount } = req.body;
    if (amount <= 0) return res.status(400).json({ error: "Banked amount must be greater than 0" });

    await complianceRepo.saveBankEntry(shipId, year, amount);
    res.json({ message: "Successfully banked surplus CB" });
});

// POST /api/pools -> Create compliance pool
router.post('/pools', async (req: Request, res: Response) => {
    try {
        const { year, members } = req.body;
        const allocatedMembers = PoolingService.allocatePool(members);
        const poolId = await complianceRepo.createPool(year, allocatedMembers);

        res.json({ message: "Pool created successfully", poolId, members: allocatedMembers });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;