// File: backend/src/core/ports/IComplianceRepository.ts

export interface PoolMemberEntity {
    shipId: string;
    cbBefore: number;
    cbAfter: number;
}

export interface IComplianceRepository {
    // Banking
    saveBankEntry(shipId: string, year: number, amount: number): Promise<void>;
    getBankedBalance(shipId: string): Promise<number>;

    // Pooling
    createPool(year: number, members: PoolMemberEntity[]): Promise<string>;
}