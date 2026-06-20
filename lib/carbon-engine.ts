/**
 * Canopy — Carbon Engine
 * All emission calculations live here. Pure functions, no side effects.
 */

import {
  TRAVEL_FACTORS,
  FOOD_FACTORS,
  ENERGY_FACTORS,
  SHOPPING_FACTORS,
  INDIAN_WEEKLY_AVERAGE,
  GLOBAL_WEEKLY_AVERAGE,
  TravelMode,
  FoodType,
  EnergyType,
  ShoppingType,
} from "./emission-factors"

export { INDIAN_WEEKLY_AVERAGE, GLOBAL_WEEKLY_AVERAGE }

export type ActivityCategory = "travel" | "food" | "energy" | "shopping"

export interface TravelActivity {
  category: "travel"
  mode: TravelMode
  distance: number // km
}

export interface FoodActivity {
  category: "food"
  type: FoodType
  meals: number // number of meals
}

export interface EnergyActivity {
  category: "energy"
  type: EnergyType
  kwh: number
}

export interface ShoppingActivity {
  category: "shopping"
  type: ShoppingType
  quantity: number
}

export type Activity = TravelActivity | FoodActivity | EnergyActivity | ShoppingActivity

export interface ActivityLog {
  id: string
  activity: Activity
  emissions: number // kg CO₂
  timestamp: number // unix ms
  label: string
}

/** Calculate kg CO₂ for a given activity */
export function calculateEmissions(activity: Activity): number {
  switch (activity.category) {
    case "travel":
      return round2(TRAVEL_FACTORS[activity.mode] * activity.distance)
    case "food":
      return round2(FOOD_FACTORS[activity.type] * activity.meals)
    case "energy":
      return round2(ENERGY_FACTORS[activity.type] * activity.kwh)
    case "shopping":
      return round2(SHOPPING_FACTORS[activity.type] * activity.quantity)
  }
}

/** Build a human-readable label for an activity */
export function buildActivityLabel(activity: Activity): string {
  switch (activity.category) {
    case "travel": {
      const modes: Record<TravelMode, string> = {
        petrol_car: "Petrol Car",
        diesel_car: "Diesel Car",
        electric_car: "Electric Car",
        bus: "Bus",
        auto_rickshaw: "Auto Rickshaw",
        metro: "Metro",
        domestic_flight: "Domestic Flight",
        international_flight: "International Flight",
      }
      return `${modes[activity.mode]} — ${activity.distance} km`
    }
    case "food": {
      const foods: Record<FoodType, string> = {
        beef: "Beef meal",
        lamb: "Lamb meal",
        chicken: "Chicken meal",
        fish: "Fish meal",
        vegetarian: "Vegetarian meal",
        vegan: "Vegan meal",
      }
      return `${foods[activity.type]} ×${activity.meals}`
    }
    case "energy":
      return `Electricity — ${activity.kwh} kWh`
    case "shopping": {
      const items: Record<ShoppingType, string> = {
        clothing: "Clothing purchase",
        online_order: "Online order",
        smartphone: "Smartphone purchase",
      }
      return `${items[activity.type]} ×${activity.quantity}`
    }
  }
}

/** Canopy Score formula: 100 − ((weekly / 34.3) × 50), clamped 0–100 */
export function calculateCanopyScore(weeklyEmissions: number): number {
  const raw = 100 - (weeklyEmissions / INDIAN_WEEKLY_AVERAGE) * 50
  return Math.round(Math.min(100, Math.max(0, raw)))
}

/** How much better/worse vs Indian average (%) */
export function vsIndianAverage(weeklyEmissions: number): number {
  return round2(((INDIAN_WEEKLY_AVERAGE - weeklyEmissions) / INDIAN_WEEKLY_AVERAGE) * 100)
}

/** How much better/worse vs global average (%) */
export function vsGlobalAverage(weeklyEmissions: number): number {
  return round2(((GLOBAL_WEEKLY_AVERAGE - weeklyEmissions) / GLOBAL_WEEKLY_AVERAGE) * 100)
}

/** Sum emissions within a date window */
export function sumEmissionsInWindow(logs: ActivityLog[], from: number, to: number): number {
  return round2(
    logs
      .filter((l) => l.timestamp >= from && l.timestamp <= to)
      .reduce((acc, l) => acc + l.emissions, 0)
  )
}

/** Group emissions by category */
export function emissionsByCategory(logs: ActivityLog[]): Record<ActivityCategory, number> {
  const totals: Record<ActivityCategory, number> = {
    travel: 0,
    food: 0,
    energy: 0,
    shopping: 0,
  }
  for (const log of logs) {
    totals[log.activity.category] = round2(totals[log.activity.category] + log.emissions)
  }
  return totals
}

/** Get the start of today as unix ms */
export function startOfDay(date = new Date()): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** Get start of week (Monday) */
export function startOfWeek(date = new Date()): number {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** Get start of month */
export function startOfMonth(date = new Date()): number {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** Build daily totals array for the last N days */
export function dailyTotals(logs: ActivityLog[], days = 7): number[] {
  return Array.from({ length: days }, (_, i) => {
    const day = new Date()
    day.setDate(day.getDate() - (days - 1 - i))
    const from = startOfDay(day)
    const to = from + 86_400_000
    return round2(
      logs
        .filter((l) => l.timestamp >= from && l.timestamp < to)
        .reduce((acc, l) => acc + l.emissions, 0)
    )
  })
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
