/**
 * Canopy - Challenge Engine Tests
 */

import { computeChallengeProgress, isChallengeCompleted, CHALLENGE_DEFINITIONS } from "../lib/challenge-engine"
import type { ActivityLog } from "../lib/carbon-engine"

const now = Date.now()

function makeLog(type: string, category: string, quantity: number): ActivityLog {
  return {
    id: Math.random().toString(36).slice(2),
    activity: { category: category as any, type, quantity, unit: "km" },
    emissions: 0.5,
    timestamp: now - 1000,
    label: `${type} log`,
  }
}

describe("CHALLENGE_DEFINITIONS", () => {
  it("has at least one challenge defined", () => {
    expect(Object.keys(CHALLENGE_DEFINITIONS).length).toBeGreaterThan(0)
  })

  it("every challenge has title, target and unit", () => {
    for (const def of Object.values(CHALLENGE_DEFINITIONS)) {
      expect(def.title.length).toBeGreaterThan(0)
      expect(def.target).toBeGreaterThan(0)
      expect(def.unit.length).toBeGreaterThan(0)
    }
  })
})

describe("isChallengeCompleted", () => {
  it("returns true when current meets or exceeds target", () => {
    const id = Object.keys(CHALLENGE_DEFINITIONS)[0] as any
    const target = CHALLENGE_DEFINITIONS[id].target
    expect(isChallengeCompleted(id, target)).toBe(true)
    expect(isChallengeCompleted(id, target + 1)).toBe(true)
  })

  it("returns false when current is below target", () => {
    const id = Object.keys(CHALLENGE_DEFINITIONS)[0] as any
    const target = CHALLENGE_DEFINITIONS[id].target
    expect(isChallengeCompleted(id, target - 1)).toBe(false)
  })
})

describe("computeChallengeProgress", () => {
  it("returns a non-negative number", () => {
    const id = Object.keys(CHALLENGE_DEFINITIONS)[0] as any
    const result = computeChallengeProgress(id, [], now - 7 * 86400000)
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it("returns 0 for empty logs", () => {
    const id = "public_transit_twice" as any
    expect(computeChallengeProgress(id, [], now - 7 * 86400000)).toBe(0)
  })
})
