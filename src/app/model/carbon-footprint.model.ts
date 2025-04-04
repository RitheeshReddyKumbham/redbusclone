export interface CarbonFootprint {
  carbonEmission: number;  // in kg CO2
  isEcoFriendly: boolean;
  ecoPoints: number;
  savingsVsAverage?: number; // Optional: CO2 savings compared to average
}