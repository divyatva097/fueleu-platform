// File: backend/src/adapters/outbound/postgres/RouteRepository.ts

import prisma from '../../../infrastructure/db/prisma';
import { IRouteRepository } from '../../../core/ports/IRouteRepository';
import { RouteEntity } from '../../../core/domain/Route';

export class RouteRepository implements IRouteRepository {
    async findAll(): Promise<RouteEntity[]> {
        return await prisma.route.findMany();
    }

    async findById(routeId: string): Promise<RouteEntity | null> {
        return await prisma.route.findUnique({
            where: { routeId }, // Using routeId (e.g., "R001") as the identifier
        });
    }

    async setBaseline(routeId: string): Promise<void> {
        // 1. Remove the baseline flag from all routes
        await prisma.route.updateMany({
            data: { isBaseline: false },
        });

        // 2. Set the baseline flag for the specific route
        await prisma.route.update({
            where: { routeId },
            data: { isBaseline: true },
        });
    }

    async getBaseline(): Promise<RouteEntity | null> {
        return await prisma.route.findFirst({
            where: { isBaseline: true },
        });
    }
}