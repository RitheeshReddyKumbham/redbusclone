import { Component, Input, OnInit } from '@angular/core';

interface RouteDetails {
  duration: number;
  arrivalTime: number;
  source?: string;
  destination?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-bus-box',
  templateUrl: './bus-box.component.html',
  styleUrls: ['./bus-box.component.css']
})
export class BusBoxComponent implements OnInit {
  @Input() rating: number[] = [];
  @Input() operatorname: string = '';
  @Input() bustype: string = '';
  @Input() departuretime: string = '';
  @Input() reschedulable: number = 0;
  @Input() livetracking: number = 0;
  @Input() filledseats: any[] = [];
  @Input() routedetails: RouteDetails = { duration: 0, arrivalTime: 0 };
  @Input() busid: string = '';
  @Input() carbonFootprint: number = 0;
  @Input() isEcoFriendly: boolean = false;
  @Input() ecoPoints: number = 0;

  avgrating: number = 0;
  totalreview: number = 0;
  seatprice: number = 0;
  bustypename: string = '';
  busdeparturetime: number = 0;
  busarrivaltime: number = 0;

  ngOnInit(): void {
    this.calculateRating();
    this.calculateSeatPrice();
    this.calculateTimes();
  }

  private calculateRating(): void {
    if (this.rating?.length > 0) {
      this.totalreview = this.rating.length;
      this.avgrating = this.rating.reduce((acc, item) => acc + item, 0) / this.totalreview;
    }
  }

  private calculateSeatPrice(): void {
    if (this.routedetails?.duration) {
      const duration = Math.floor(this.routedetails.duration);
      switch (this.bustype.toLowerCase()) {
        case 'standard':
          this.seatprice = 50 * duration / 2;
          this.bustypename = 'Standard';
          break;
        case 'sleeper':
          this.seatprice = 100 * duration / 2;
          this.bustypename = 'Sleeper';
          break;
        case 'a/c seater':
          this.seatprice = 125 * duration / 2;
          this.bustypename = 'A/C Seater';
          break;
        default:
          this.seatprice = 75 * duration / 2;
          this.bustypename = 'Non - A/C';
      }
    }
  }

  private calculateTimes(): void {
    if (this.departuretime) {
      const numericvalue = parseInt(this.departuretime, 10);
      if (!isNaN(numericvalue)) {
        this.busdeparturetime = numericvalue;
        this.busarrivaltime = (numericvalue + (this.routedetails?.duration || 0)) % 24;
      }
    }
  }

  getAvailableSeats(): number {
    return this.filledseats ? 40 - this.filledseats.length : 40;
  }

  getFormattedTime(time: number): string {
    return time < 10 ? `0${time}:00` : `${time}:00`;
  }

  getFormattedDepartureTime(): string {
    return this.getFormattedTime(this.busdeparturetime);
  }

  getFormattedArrivalTime(): string {
    return this.getFormattedTime(this.busarrivaltime);
  }
}