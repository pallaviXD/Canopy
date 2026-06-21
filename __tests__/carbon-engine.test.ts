/**
 * Canopy - Carbon Engine Tests
 */

import {
  calculateEmissions,
  calculateCanopyScore,
  buildActivityLabel,
  sumEmissionsInWindow,
} from "../lib/carbon-engine"
import type { Activity, ActivityLog } from "../lib/carbon-engine"

// ---------------------------------------------------------------------------
// calculateEmissions
// ---------------------------------------------------------------------------
describe("calculateEmissions", () => {
  it("returns positive emissions for a petrol car trip", () => {
    const activity: Activity = { category: "travel", mode: "petrol_car", distance: 10 }
    expect(calculateEmissions(activity)).toBeGreaterThan(0)
  })

  it("metro has lower emissions than petrol car per km", () => {
    const car: Activity = { category: "travel", mode: "petrol_car", distance: 10 }
    const metro: Activity = { category: "travel", mode: "metro", distance: 10 }
    expect(calculateEmissions(metro)).toBeLessThan(calculateEmissions(car))
  })

  it("vegan meal has lower emissions than beef", () => {
    const beef: Activity = { category: "food", type: "beef", meals: 1 }
    const vegan: Activity = { category: "food", type: "vegan", meals: 1 }
    expect(calculateEmissions(vegan)).toBeLessThan(calculateEmissions(beef))
  })

  it("returns 0 for zero distance", () => {
    const activity: Activity = { category: "travel", mode: "petrol_car", distance: 0 }
    expect(calculateEmissions(activity)).toBe(0)
  })

  it("scales linearly with distance", () => {
    const a1: Activity = { category: "travel", mode: "bus", distance: 5 }
    const a2: Activity = { category: "travel", mode: "bus", distance: 10 }
    expect(calculateEmissions(a2)).toBeCloseTo(calculateEmissions(a1) * 2, 1)
  })

  it("domestic flight has higher emissions than metro", () => {
    const flight: Activity = { category: "travel", mode: "domestic_flight", distance: 100 }
    const metro: Activity = { category: "travel", mode: "metro", distance: 100 }
    expect(calculateEmissions(flight)).toBeGreaterThan(calculateEmissions(metro))
  })
})

// ---------------------------------------------------------------------------
// calculateCanopyScore
// ---------------------------------------------------------------------------
describe("calculateCanopyScore", () => {
  it("returns 100 for zero emissions", () => {
    expect(calculateCanopyScore(0)).toBe(100)
  })

  it("returns a value between 0 and 100", () => {
    const score = calculateCanopyScore(20)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it("lower emissions give higher score", () => {
    expect(calculateCanopyScore(5)).toBeGreaterThan(calculateCanopyScore(30))
  })

  it("very high emissions return 0", () => {
    expect(calculateCanopyScore(1000)).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// buildActivityLabel
// ---------------------------------------------------------------------------
describe("buildActivityLabel", () => {
  it("returns a non-empty string for travel", () => {
    const activity: Activity = { category: "travel", mode: "petrol_car", distance: 15 }
    const label = buildActivityLabel(activity)
    expect(typeof label).toBe("string")
    expect(label.length).toBeGreaterThan(0)
  })

  it("includes distance in travel label", () => {
    const activity: Activity = { category: "travel", mode: "metro", distance: 12 }
    const label = buildActivityLabel(activity)
    expect(label).toContain("12")
  })

  it("includes meal count in food label", () => {
    const activity: Activity = { category: "food", type: "beef", meals: 3 }
    const label = buildActivityLabel(activity)
    expect(label).toContain("3")
  })

  it("returns a label for energy activity", () => {
    const activity: Activity = { category: "energy", type: "electricity", kwh: 5 }
    const label = buildActivityLabel(activity)
    expect(label.length).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// sumEmissionsInWindow
// ---------------------------------------------------------------------------
describe("sumEmissionsInWindow", () => {
  const now = Date.now()

  const logs: ActivityLog[] = [
    {
      id: "1",
      activity: { category: "travel", mode: "petrol_car", distance: 10 },
      emissions: 2.1,
      timestamp: now - 1000,
      label: "Car trip",
    },
    {
      id: "2",
      activity: { category: "food", type: "beef", meals: 1 },
      emissions: 3.0,
      timestamp: now - 2000,
      label: "Beef meal",
    },
    {
      id: "3",
      activity: { category: "travel", mode: "metro", distance: 5 },
      emissions: 0.2,
      timestamp: now - 10 * 24 * 60 * 60 * 1000,
      label: "Metro",
    },
  ]

  it("sums emissions within the window", () => {
    const total = sumEmissionsInWindow(logs, now - 5000, now)
    expect(total).toBeCloseTo(5.1, 1)
  })

  it("excludes logs outside the window", () => {
    const total = sumEmissionsInWindow(logs, now - 5000, now)
    expect(total).toBeLessThan(5.4)
  })

  it("returns 0 for empty logs", () => {
    expect(sumEmissionsInWindow([], now - 5000, now)).toBe(0)
  })
})
