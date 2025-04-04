# Carbon Footprint Calculator for RedBus Clone

This feature calculates the carbon footprint of bus journeys and provides eco-friendly travel options to users. It aims to promote sustainable travel by offering incentives for choosing greener options.

## Key Components

### 1. Carbon Footprint Service
- Located at: `frontend/src/app/service/carbon-footprint.service.ts`
- Calculates emissions based on bus type and journey distance
- Determines if a bus option is eco-friendly
- Awards eco-points for choosing greener options

### 2. Bus Model Updates
- Updated `Bus` interface to include:
  - `carbonFootprint`: CO2 emissions for the journey
  - `isEcoFriendly`: Flag for eco-friendly options
  - `ecoPoints`: Points awarded for choosing this option

### 3. Bus Service Integration
- Modified `BusService` to:
  - Calculate carbon footprint for all buses when fetched
  - Inject the `CarbonFootprintService`
  - Process routes to estimate distance and emissions

### 4. Bus Box UI Updates
- Added visual indicators for:
  - Carbon footprint with tooltip
  - Eco-friendly status with green icon
  - Eco-points display for eco-friendly options

### 5. Eco Rewards System
- New component at `frontend/src/app/Component/eco-rewards`
- Allows users to:
  - View accumulated eco-points
  - Redeem points for rewards
  - Learn about eco-friendly travel options

## How It Works

1. When buses are loaded, the system calculates:
   - Carbon emissions based on bus type and journey distance
   - Whether each bus is eco-friendly compared to average
   - Eco-points that would be earned by booking

2. The UI displays:
   - Carbon footprint values with clear visual indicators
   - Eco-friendly options highlighted in green
   - Potential eco-points for each journey

3. When a user books an eco-friendly option:
   - Eco-points are awarded and stored
   - Points can be redeemed for rewards in the Eco Rewards section

## Integration Notes

Due to the file update limitations, the following files need to be manually replaced with their new versions:
- `bus.model.ts` → `bus.model.ts.new`
- `bus.service.ts` → `bus.service.ts.new`
- `bus-box.component.ts` → `bus-box.component.ts.new`
- `bus-box.component.html` → `bus-box.component.html.new`
- `navbar.component.html` → Add eco-rewards link

## Rewards System

The eco-rewards system offers incentives like:
- Discount coupons (5% and 10%)
- Free snacks on board
- Priority boarding
- Tree planting contributions

These rewards encourage users to consistently choose eco-friendly travel options, creating positive environmental impact through the platform.