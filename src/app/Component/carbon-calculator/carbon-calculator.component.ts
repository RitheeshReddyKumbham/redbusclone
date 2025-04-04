import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarbonCalculatorService } from '../../service/carbon-calculator.service';

@Component({
  selector: 'app-carbon-calculator',
  templateUrl: './carbon-calculator.component.html',
  styleUrls: ['./carbon-calculator.component.scss']
})
export class CarbonCalculatorComponent {
  calculatorForm!: FormGroup;
  showResults = false;
  totalEmissions = 0;
  emissionsPerPerson = 0;
  ecoTip = '';
  rewardPoints = 0;
  sustainabilityBadge = '';

  private readonly EMISSION_FACTORS: { [key: string]: number } = {
    regular: 0.096,   // kg CO2 per passenger per km
    electric: 0.015,  // kg CO2 per passenger per km
    hybrid: 0.065    // kg CO2 per passenger per km
  };

  constructor(
    private fb: FormBuilder,
    private carbonService: CarbonCalculatorService
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.calculatorForm = this.fb.group({
      distance: ['', [Validators.required, Validators.min(1)]],
      busType: ['regular', Validators.required],
      passengers: ['', [Validators.required, Validators.min(1)]]
    });
  }

  calculateEmissions(): void {
    if (this.calculatorForm.valid) {
      const formValue = this.calculatorForm.value;
      const busType = formValue.busType as 'electric' | 'hybrid' | 'regular';
      const distance = Number(formValue.distance);
      const passengers = Number(formValue.passengers);

      // Calculate total emissions
      const emissionFactor = this.EMISSION_FACTORS[busType];
      this.totalEmissions = +(distance * emissionFactor).toFixed(2);
      
      // Calculate per person emissions
      this.emissionsPerPerson = +(this.totalEmissions / passengers).toFixed(2);
      
      // Calculate reward points
      this.rewardPoints = this.carbonService.calculateRewardPoints(
        busType, 
        distance
      );
      
      // Get sustainability badge
      this.sustainabilityBadge = this.carbonService.getSustainabilityBadge(
        this.rewardPoints
      );
      
      // Generate eco tip
      this.generateEcoTip(busType);
      
      // Show results
      this.showResults = true;
    }
  }

  private generateEcoTip(busType: string): void {
    switch (busType) {
      case 'regular':
        this.ecoTip = 'Tip: Choosing an electric bus could reduce your carbon footprint by up to 84%!';
        break;
      case 'hybrid':
        this.ecoTip = 'Great choice! Hybrid buses reduce emissions. Consider electric buses for even lower impact.';
        break;
      case 'electric':
        this.ecoTip = 'Excellent choice! Electric buses have the lowest carbon footprint.';
        break;
      default:
        this.ecoTip = 'Every sustainable choice makes a difference!';
    }
  }

  // Form getters for template
  get distance() {
    return this.calculatorForm.get('distance');
  }

  get busType() {
    return this.calculatorForm.get('busType');
  }

  get passengers() {
    return this.calculatorForm.get('passengers');
  }

  // Reset form and results
  resetCalculator(): void {
    this.calculatorForm.reset({
      busType: 'regular'
    });
    this.showResults = false;
    this.totalEmissions = 0;
    this.emissionsPerPerson = 0;
    this.ecoTip = '';
    this.rewardPoints = 0;
    this.sustainabilityBadge = '';
  }

  // Form validation messages
  getErrorMessage(field: string): string {
    const control = this.calculatorForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('min')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be greater than 0`;
    }
    return '';
  }

  // Check if form field is invalid
  isFieldInvalid(field: string): boolean {
    const control = this.calculatorForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
