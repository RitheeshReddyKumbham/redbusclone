// src/app/routes/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component Imports
import { EcoRewardsComponent } from '../Component/eco-rewards/eco-rewards.component';
import { CarbonCalculatorComponent } from '../Component/carbon-calculator/carbon-calculator.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
  
  { 
    path: 'carbon-calculator', 
    component: CarbonCalculatorComponent 
  },
  // Add your other routes here
  { 
    path: '**', 
    redirectTo: '/home' 
  } ,{
    path:'carbon-calculator',
    component:CarbonCalculatorComponent

  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      useHash: false
    })
  ],
  exports: [RouterModule]
})


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }