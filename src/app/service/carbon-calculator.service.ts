// src/app/service/carbon-calculator.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarbonCalculatorService {
  private readonly REWARDS_POINTS: { [key: string]: number } = {
    'electric': 50,
    'hybrid': 30,
    'regular': 10
  };

  calculateRewardPoints(busType: 'electric' | 'hybrid' | 'regular', distance: number): number {
    if (busType in this.REWARDS_POINTS) {
      return this.REWARDS_POINTS[busType] * Math.floor(distance / 100);
    }
    return 0; // Return 0 points if bus type is not found
  }

  getSustainabilityBadge(totalPoints: number): string {
    if (totalPoints >= 1000) return 'Eco Warrior';
    if (totalPoints >= 500) return 'Green Traveler';
    if (totalPoints >= 100) return 'Eco Starter';
    return 'New Explorer';
  }
}
