import { Component, OnInit } from '@angular/core';
import { CarbonFootprintService } from '../../service/carbon-footprint.service';

@Component({
  selector: 'app-eco-rewards',
  templateUrl: './eco-rewards.component.html',
  styleUrls: ['./eco-rewards.component.css']
})
export class EcoRewardsComponent implements OnInit {
  userEcoPoints: number = 0;
  ecoRewards: any[] = [
    { name: 'Discount Coupon (5%)', pointsRequired: 20, id: 'discount5' },
    { name: 'Discount Coupon (10%)', pointsRequired: 50, id: 'discount10' },
    { name: 'Free Snack on Board', pointsRequired: 30, id: 'freesnack' },
    { name: 'Priority Boarding', pointsRequired: 25, id: 'priorityboarding' },
    { name: 'Plant a Tree Contribution', pointsRequired: 15, id: 'plantatree' }
  ];
  
  // Mock user data - in a real app, this would come from a user service
  userRedemptions: string[] = [];
  
  constructor() { }

  ngOnInit(): void {
    // In a real app, we would fetch the user's eco points from a service
    this.loadUserEcoPoints();
  }

  loadUserEcoPoints(): void {
    // Mock implementation - in a real app, fetch from backend
    const savedPoints = localStorage.getItem('userEcoPoints');
    this.userEcoPoints = savedPoints ? parseInt(savedPoints, 10) : 0;
    
    const savedRedemptions = localStorage.getItem('userRedemptions');
    this.userRedemptions = savedRedemptions ? JSON.parse(savedRedemptions) : [];
  }

  redeemReward(reward: any): void {
    if (this.userEcoPoints >= reward.pointsRequired && !this.userRedemptions.includes(reward.id)) {
      this.userEcoPoints -= reward.pointsRequired;
      this.userRedemptions.push(reward.id);
      
      // Save to localStorage (in a real app, save to backend)
      localStorage.setItem('userEcoPoints', this.userEcoPoints.toString());
      localStorage.setItem('userRedemptions', JSON.stringify(this.userRedemptions));
      
      alert(`Successfully redeemed: ${reward.name}`);
    } else if (this.userRedemptions.includes(reward.id)) {
      alert('You have already redeemed this reward');
    } else {
      alert(`Not enough eco-points. You need ${reward.pointsRequired - this.userEcoPoints} more points.`);
    }
  }

  isRewardRedeemed(rewardId: string): boolean {
    return this.userRedemptions.includes(rewardId);
  }

  // Add eco points from a journey (would be called after booking)
  addEcoPoints(points: number): void {
    this.userEcoPoints += points;
    localStorage.setItem('userEcoPoints', this.userEcoPoints.toString());
  }
}