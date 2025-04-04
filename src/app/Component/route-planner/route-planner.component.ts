import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RoutePlanningService, Location, RouteInfo } from '../../service/route-planning.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-route-planner',
  templateUrl: './route-planner.component.html',
  styleUrls: ['./route-planner.component.scss']
})
export class RoutePlannerComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  routeForm: FormGroup;
  routeInfo: RouteInfo | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private routeService: RoutePlanningService
  ) {
    this.routeForm = this.fb.group({
      waypoints: this.fb.array([
        this.createWaypointGroup('start'),
        this.createWaypointGroup('end')
      ])
    });
  }

  ngOnInit() {
    this.setupLocationSearch();
  }

  get waypoints(): FormArray {
    return this.routeForm.get('waypoints') as FormArray;
  }

  private createWaypointGroup(type: 'start' | 'waypoint' | 'end') {
    return this.fb.group({
      address: [''],
      location: [null],
      stopType: [type],
      searchResults: [[]]
    });
  }

  private setupLocationSearch() {
    this.waypoints.controls.forEach(control => {
      control.get('address')?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => this.routeService.searchLocations(value).pipe(
          catchError(error => {
            console.error('Location search error:', error);
            return of([]);  // Return empty array on error
          })
        ))
      ).subscribe(results => {
        control.patchValue({ searchResults: results }, { emitEvent: false });
      });
    });
  }

  addWaypoint() {
    this.waypoints.insert(this.waypoints.length - 1, this.createWaypointGroup('waypoint'));
  }

  removeWaypoint(index: number) {
    if (this.waypoints.length > 2) {  // Always keep the start and end waypoints
      this.waypoints.removeAt(index);
    }
  }

  selectLocation(waypointIndex: number, location: Location) {
    const waypoint = this.waypoints.at(waypointIndex);
    waypoint.patchValue({
      address: location.address,
      location: location,
      searchResults: []
    });
  }

  calculateRoute() {
    if (!this.routeForm.valid) {
      console.warn('Route form is invalid');
      return;
    }

    const waypoints = this.routeForm.get('waypoints')?.value;

    const validWaypoints = waypoints.every((wp: any) => wp.location);
    if (!validWaypoints) {
      console.warn('Please select a valid location for each waypoint.');
      return;
    }

    this.loading = true;
    this.routeService.calculateRoute(waypoints).subscribe(
      (routeInfo: RouteInfo) => {
        this.routeInfo = routeInfo;
        this.loading = false;
      },
      error => {
        console.error('Route calculation error:', error);
        this.loading = false;
      }
    );
  }
}
