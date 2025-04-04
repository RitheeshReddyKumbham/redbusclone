// src/app/model/carbon-calculator.model.ts
export interface CarbonCalculation {
    distance: number;
    busType: 'regular' | 'electric' | 'hybrid';
    passengers: number;
}

export interface CarbonResult {
    totalEmissions: number;
    emissionsPerPerson: number;
    rewardPoints: number;
    sustainabilityBadge: string;
}
