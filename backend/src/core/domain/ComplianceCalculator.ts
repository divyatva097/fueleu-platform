// File: backend/src/core/domain/ComplianceCalculator.ts

import { FuelEUConstants } from './FuelEUConstants';

export class ComplianceCalculator {
    static calculateEnergyInScope(fuelConsumption: number): number {
        return fuelConsumption * FuelEUConstants.ENERGY_DENSITY_MJ_PER_TON;
    }

    static calculateCB(ghgIntensity: number, fuelConsumption: number): number {
        const energyInScope = this.calculateEnergyInScope(fuelConsumption);

        // Positive CB = Surplus, Negative CB = Deficit
        const balance = (FuelEUConstants.TARGET_INTENSITY_2025 - ghgIntensity) * energyInScope;
        return balance;
    }
}