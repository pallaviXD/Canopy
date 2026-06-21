/**
 * Canopy - Ecosystem Engine Tests
 * Validates visual state and stage progression.
 */

import { getEcosystemState, computeEcosystemScore } from "../lib/ecosystem-engine"
import type { EcosystemInput } from "../lib/ecosystem-engine"

const baseInput: EcosystemInput = {
  canopyScore: 70,
  completedChallenges: 2,
  totalChallenges: 5,
  streakDays: 7,
  weeklyEmissions: 15,
  previousWeekEmissions: 20,
  totalLogsCount: 10,
}

describe("computeEcosystemScore", () => {
  it("returns a number between 0 and 100", () => {
    const score = computeEcosystemScore(baseInput)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it("higher canopy score gives higher ecosystem score", () => {
    const low = computeEcosystemScore({ ...baseInput, canopyScore: 20 })
    const high = computeEcosystemScore({ ...baseInput, canopyScore: 90 })
    expect(high).toBeGreaterThan(low)
  })

  it("more completed challenges increases score", () => {
    const few = computeEcosystemScore({ ...baseInput, completedChallenges: 0, totalChallenges: 5 })
    const many = computeEcosystemScore({ ...baseInput, completedChallenges: 5, totalChallenges: 5 })
    expect(many).toBeGreaterThan(few)
  })

  it("improving weekly emissions increases score", () => {
    const worse = computeEcosystemScore({ ...baseInput, weeklyEmissions: 40, previousWeekEmissions: 20 })
    const better = computeEcosystemScore({ ...baseInput, weeklyEmissions: 10, previousWeekEmissions: 20 })
    expect(better).toBeGreaterThan(worse)
  })
})

describe("getEcosystemState", () => {
  it("returns a valid stage between 1 and 7", () => {
    const state = getEcosystemState(baseInput)
    expect(state.stage).toBeGreaterThanOrEqual(1)
    expect(state.stage).toBeLessThanOrEqual(7)
  })

  it("returns a non-empty label and description", () => {
    const state = getEcosystemState(baseInput)
    expect(state.label.length).toBeGreaterThan(0)
    expect(state.description.length).toBeGreaterThan(0)
  })

  it("health is between 0 and 100", () => {
    const state = getEcosystemState(baseInput)
    expect(state.health).toBeGreaterThanOrEqual(0)
    expect(state.health).toBeLessThanOrEqual(100)
  })

  it("high score input gives higher stage than low score", () => {
    const low = getEcosystemState({ ...baseInput, canopyScore: 5, completedChallenges: 0, streakDays: 0 })
    const high = getEcosystemState({ ...baseInput, canopyScore: 95, completedChallenges: 5, streakDays: 30 })
    expect(high.stage).toBeGreaterThanOrEqual(low.stage)
  })

  it("bare soil state has no birds or butterflies", () => {
    const bare = getEcosystemState({
      canopyScore: 0,
      completedChallenges: 0,
      totalChallenges: 0,
      streakDays: 0,
      weeklyEmissions: 100,
      previousWeekEmissions: 100,
      totalLogsCount: 0,
    })
    expect(bare.hasBirds).toBe(false)
    expect(bare.hasButterflies).toBe(false)
  })

  it("flourishing state has birds and butterflies", () => {
    const flourish = getEcosystemState({
      canopyScore: 99,
      completedChallenges: 10,
      totalChallenges: 10,
      streakDays: 30,
      weeklyEmissions: 2,
      previousWeekEmissions: 10,
      totalLogsCount: 100,
    })
    expect(flourish.hasBirds).toBe(true)
    expect(flourish.hasButterflies).toBe(true)
  })
})
