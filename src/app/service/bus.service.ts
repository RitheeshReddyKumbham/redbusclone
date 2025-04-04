import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Bus } from '../model/bus.model';
import { url } from '../config';
import { Booking } from '../model/booking.model';
import { CarbonFootprintService } from './carbon-footprint.service';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private busbookapi: string = url + 'booking/'
  private apiurl: string = url + 'routes/'
  constructor(private http: HttpClient, private carbonService: CarbonFootprintService) { }
  
  GETBUSDETAILS(depart: string, arrival: string, date: string): Observable<Bus[]> {
    const url = `${this.apiurl}${depart}/${arrival}/${date}`;
    console.log(depart,arrival,date)
    return this.http.get<Bus[]>(url).pipe(
      map(buses => this.calculateCarbonFootprint(buses))
    );
  }

  /**
   * Calculate carbon footprint for each bus in the list
   * @param buses List of buses
   * @returns List of buses with carbon footprint data
   */
  private calculateCarbonFootprint(buses: Bus[]): Bus[] {
    return buses.map(bus => {
      // Get route details to calculate distance
      const routeObj = typeof bus.routes === 'string' ? JSON.parse(bus.routes) : bus.routes;
      const distance = this.carbonService.calculateDistanceFromDuration(routeObj.duration || 0);
      
      // Calculate carbon footprint
      const carbonFootprint = this.carbonService.calculateCarbonFootprint(bus.busType, distance);
      const isEcoFriendly = this.carbonService.isEcoFriendly(carbonFootprint, bus.busType);
      const ecoPoints = this.carbonService.calculateEcoPoints(carbonFootprint, bus.busType);
      
      // Return bus with carbon footprint information
      return {
        ...bus,
        carbonFootprint,
        isEcoFriendly,
        ecoPoints
      };
    });
  }

  addbusmongo(myBooking:any):Observable<Booking>{
    const busbook: Booking = {
      customerId:myBooking.customerId,
      passengerDetails:myBooking.passengerDetails,
      email:myBooking.email,
      phoneNumber:myBooking.phoneNumber,
      fare:myBooking.fare,
      status:myBooking.status,
      bookingDate:myBooking.bookingDate,
      busId:myBooking.busId,
      seats: myBooking.seats,
      departureDetails:myBooking.departureDetails,
      arrivalDetails:myBooking.arrivalDetails,
      duration:myBooking.duration,
      isBusinessTravel:myBooking.isBusinessTravel,
      isInsurance: myBooking.isInsurance ,
      isCovidDonated:myBooking.isCovidDonated
    };
    return this.http.post<Booking>(this.busbookapi,busbook)
  }

  getbusmongo(id:string):Observable<Booking[]>{
    const url=`${this.busbookapi}${id}`;
    return this.http.get<Booking[]>(url);
  }
}