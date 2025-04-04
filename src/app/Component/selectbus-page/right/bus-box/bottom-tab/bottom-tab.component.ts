import { Component, Input } from '@angular/core';

interface RouteDetails {
  duration: number;
  arrivalTime: number;
  source?: string;
  destination?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-bottom-tab',  
  templateUrl: './bottom-tab.component.html',
  styleUrls: ['./bottom-tab.component.css']
})
export class BottomTabComponent {
  @Input() busid: string = '';
  @Input() filledseats: any[] = [];
  @Input() seatprice: number = 0;
  @Input() routedetails: RouteDetails = { duration: 0, arrivalTime: 0 };
  @Input() departuretime: string = '';
  @Input() bustypename: string = '';
  @Input() bustype: string = '';
  @Input() operatorname: string = '';
  @Input() ecoPoints: number = 0;

  getAvailableSeats(): number {
    return 40 - (this.filledseats?.length || 0);
  }

  get formattedPrice(): string {
    return `₹ ${this.seatprice.toFixed(2)}`;
  }

  get ecoFriendlyStatus(): string {
    return this.ecoPoints > 0 ? `Eco-Friendly (${this.ecoPoints} pts)` : 'Not Eco-Friendly';
  }
}

