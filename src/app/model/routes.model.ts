// routes.model.ts

// Define the RouteDetails interface
export interface RouteDetails {
  duration: number;  // Duration of the route
  arrivalTime: number;  // Arrival time
  source?: string;  // Optional property for the source
  destination?: string;  // Optional property for the destination
  departureLocation: { 
    name: string; 
    subLocations: string[]; 
  };  // Departure location object
  arrivalLocation: { 
    name: string; 
    subLocations: string[]; 
  };  // Arrival location object
}

// Define the Route interface (if you don't already have it)
export interface Route {
  busId: string;
  departureLocation: { name: string; subLocations: string[] };
  arrivalLocation: { name: string; subLocations: string[] };
  duration: number;
  arrivalTime: number;
  source: string;
  destination: string;
  // Other properties of the Route
}
// src/app/model/routes.model.ts
export interface Route {
  duration: number;
  arrivalTime: number;
  source: string;
  destination: string;
  busId: string;
  operatorName: string;
  busType: string;
  departureTime: string;
  isReschedulable: number;
  hasLiveTracking: number;
  ratings: number[];
  carbonFootprint: number;
  isEcoFriendly: boolean;
  ecoPoints: number;
  [key: string]: any;
}
