/**
 * Canopy — Emission Factors Configuration
 * Single source of truth for all CO₂ emission coefficients.
 * All values in kg CO₂ per unit.
 */

export const TRAVEL_FACTORS = {
  petrol_car: 0.21,       // kg/km
  diesel_car: 0.17,       // kg/km
  electric_car: 0.12,     // kg/km
  bus: 0.089,             // kg/km
  auto_rickshaw: 0.13,    // kg/km
  metro: 0.041,           // kg/km
  domestic_flight: 0.255, // kg/km
  international_flight: 0.195, // kg/km
} as const

export const FOOD_FACTORS = {
  beef: 3.0,        // kg/meal
  lamb: 2.4,        // kg/meal
  chicken: 0.7,     // kg/meal
  fish: 0.6,        // kg/meal
  vegetarian: 0.3,  // kg/meal
  vegan: 0.2,       // kg/meal
} as const

export const ENERGY_FACTORS = {
  electricity: 0.82, // kg/kWh
} as const

export const SHOPPING_FACTORS = {
  clothing: 10.0,    // kg/item
  online_order: 0.5, // kg/order
  smartphone: 70.0,  // kg/item
} as const

/** Indian weekly CO₂ average (kg) used for Canopy Score baseline */
export const INDIAN_WEEKLY_AVERAGE = 34.3

/** Global weekly CO₂ average (kg) — approx 48 kg */
export const GLOBAL_WEEKLY_AVERAGE = 48.0

export type TravelMode = keyof typeof TRAVEL_FACTORS
export type FoodType = keyof typeof FOOD_FACTORS
export type EnergyType = keyof typeof ENERGY_FACTORS
export type ShoppingType = keyof typeof SHOPPING_FACTORS

export const TRAVEL_LABELS: Record<TravelMode, string> = {
  petrol_car: "Petrol Car",
  diesel_car: "Diesel Car",
  electric_car: "Electric Car",
  bus: "Bus",
  auto_rickshaw: "Auto Rickshaw",
  metro: "Metro",
  domestic_flight: "Domestic Flight",
  international_flight: "International Flight",
}

export const FOOD_LABELS: Record<FoodType, string> = {
  beef: "Beef",
  lamb: "Lamb",
  chicken: "Chicken",
  fish: "Fish",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
}

export const SHOPPING_LABELS: Record<ShoppingType, string> = {
  clothing: "Clothing (item)",
  online_order: "Online Order",
  smartphone: "Smartphone",
}
