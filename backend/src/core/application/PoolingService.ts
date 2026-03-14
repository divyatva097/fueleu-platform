// File: backend/src/core/application/PoolingService.ts

export interface PoolMemberInput {
    shipId: string;
    cbBefore: number;
}

export interface PoolMemberOutput extends PoolMemberInput {
    cbAfter: number;
}

export class PoolingService {
    static allocatePool(members: PoolMemberInput[]): PoolMemberOutput[] {
        const totalCB = members.reduce((sum, m) => sum + m.cbBefore, 0);

        // Rule 1: Sum(adjustedCB) >= 0
        if (totalCB < 0) {
            throw new Error("Invalid Pool: Total Compliance Balance must be non-negative (>= 0).");
        }

        // Initialize the after-balance array
        let allocations: PoolMemberOutput[] = members.map(m => ({
            ...m,
            cbAfter: m.cbBefore
        }));

        // Rule 2 & 3: Greedy Allocation
        // Sort descending by CB (Ships with the most surplus come first)
        allocations.sort((a, b) => b.cbBefore - a.cbBefore);

        let surplusIndex = 0; // Pointer to ship giving surplus
        let deficitIndex = allocations.length - 1; // Pointer to ship needing surplus

        while (surplusIndex < deficitIndex) {
            if (allocations[deficitIndex].cbAfter >= 0) {
                deficitIndex--; // This ship is already compliant, move up
                continue;
            }
            if (allocations[surplusIndex].cbAfter <= 0) {
                surplusIndex++; // This ship has no more surplus to give, move down
                continue;
            }

            // Calculate transfer amounts
            const deficitNeeded = Math.abs(allocations[deficitIndex].cbAfter);
            const surplusAvailable = allocations[surplusIndex].cbAfter;

            const transferAmount = Math.min(deficitNeeded, surplusAvailable);

            // Perform the transfer
            allocations[surplusIndex].cbAfter -= transferAmount;
            allocations[deficitIndex].cbAfter += transferAmount;
        }

        return allocations;
    }
}