import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusService } from '../../../service/bus.service';
import { Bus } from '../../../model/bus.model';
import { Route } from '../../../model/routes.model';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.css']
})
export class RightComponent implements OnInit {
  matchedbus: Bus[] = [];
  routes: Route[] = [];
  seats: { [key: string]: any } = {};

  departurevar: string = '';
  arrival: string = '';
  date: string = '';

  constructor(
    private route: ActivatedRoute,
    private busservice: BusService
  ) {}

  getkeys() {
    return Object.keys(this.seats);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.departurevar = params['departure'] || '';
      this.arrival = params['arrival'] || '';
      this.date = params['date'] || '';

      if (this.departurevar && this.arrival && this.date) {
        this.fetchBusDetails();
      }
    });
  }

  private fetchBusDetails(): void {
    this.busservice.GETBUSDETAILS(this.departurevar, this.arrival, this.date)
      .subscribe({
        next: (response: any) => {
          this.matchedbus = response.matchedBuses;
          this.routes = response.route;
          this.seats = response.busidwithseatobj;
        },
        error: (error: any) => {
          console.error('Error fetching bus details:', error);
        }
      });
  }
}
