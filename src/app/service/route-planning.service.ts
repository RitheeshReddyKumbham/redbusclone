import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface RoutePoint {
  location: Location;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  waypoints: RoutePoint[];
}

@Injectable({
  providedIn: 'root'
})
export class RoutePlanningService {
  private apiUrl = 'https://your-api-endpoint.com';

  constructor(private http: HttpClient) {}

  searchLocations(query: string): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/search-locations?q=${query}`);
  }

  calculateRoute(waypoints: any): Observable<RouteInfo> {
    return this.http.post<RouteInfo>(`${this.apiUrl}/calculate-route`, { waypoints });
  }
}
