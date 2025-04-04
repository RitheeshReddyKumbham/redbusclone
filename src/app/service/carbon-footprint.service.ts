import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarbonFootprintService {
  // CO2 emissions factors in kg CO2 per passenger per km
  private emissionFactors = {
    'standard': 0.032, // Average bus emissions
    'sleeper': 0.035,
    'A/C Seater': 0.045, // Higher for A/C buses
    'Non - A/C': 0.028 // Lower for non-A/C buses
  };

  constructor() { }

  /**
   * Calculate carbon footprint for a journey
   * @param busType Type of bus
   * @param distance Distance in kilometers
   * @returns Carbon footprint in kg CO2
   */
  calculateCarbonFootprint(busType: string, distance: number): number {
    // Default to standard emission factor if bus type not found
    const emissionFactor = this.emissionFactors[busType as keyof typeof this.emissionFactors] || 0.032;
    return parseFloat((emissionFactor * distance).toFixed(2));
  }

  /**
   * Calculate approximate distance from journey duration
   * @param duration Duration in hours
   * @returns Approximate distance in kilometers
   */
  calculateDistanceFromDuration(duration: number): number {
    // Assuming average bus speed of 50 km/h
    return duration * 50;
  }

  /**
   * Evaluate if a bus is eco-friendly based on its carbon footprint
   * @param carbonFootprint Carbon footprint in kg CO2
   * @param busType Type of bus
   * @returns true if eco-friendly, false otherwise
   */
  isEcoFriendly(carbonFootprint: number, busType: string): boolean {
    // A bus is considered eco-friendly if its emissions are below average for its type
    const averageEmission = this.emissionFactors[busType as keyof typeof this.emissionFactors] || 0.032;
    return carbonFootprint <= (averageEmission * 50); // 50km is used as a benchmark distance
  }

  /**
   * Calculate eco-points that can be awarded for choosing greener options
   * @param carbonFootprint Carbon footprint in kg CO2
   * @param busType Type of bus
   * @returns Eco-points (higher for greener options)
   */
  calculateEcoPoints(carbonFootprint: number, busType: string): number {
    const isEco = this.isEcoFriendly(carbonFootprint, busType);
    // Base points
    let points = isEco ? 10 : 5;
    
    // Bonus points for non-A/C buses which are typically more eco-friendly
    if (busType === 'Non - A/C') {
      points += 5;
    }
    
    return points;
  }
}