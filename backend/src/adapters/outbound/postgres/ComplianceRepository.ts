// File: backend/src/adapters/outbound/postgres/ComplianceRepository.ts

import prisma from '../../../infrastructure/db/prisma';
import { IComplianceRepository, PoolMemberEntity } from '../../../core/ports/IComplianceRepository';

export class ComplianceRepository implements IComplianceRepository {

    // --- BANKING (Article 20) ---
    async saveBankEntry(shipId: string, year: number, amount: number): Promise<void> {
        await prisma.bankEntry.create({
            data: {
                shipId,
                year,
                amount,
            },
        });
    }

    async getBankedBalance(shipId: string): Promise<number> {
        const entries = await prisma.bankEntry.findMany({
            where: { shipId },
        });

        // Sum up all banked amounts
        return entries.reduce((total: any, entry: { amount: any; }) => total + entry.amount, 0);
    }

    // --- POOLING (Article 21) ---
    async createPool(year: number, members: PoolMemberEntity[]): Promise<string> {
        // We use nested writes in Prisma to create the Pool and its Members in one transaction
        const pool = await prisma.pool.create({
            data: {
                year,
                members: {
                    create: members.map(m => ({
                        shipId: m.shipId,
                        cbBefore: m.cbBefore,
                        cbAfter: m.cbAfter,
                    })),
                },
            },
        });

        return pool.id;
    }
}