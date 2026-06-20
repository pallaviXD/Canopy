"use client"

/**
 * Canopy — Log Activity Modal
 * Full-featured activity logging dialog connected to the carbon engine.
 */

import { useState } from "react"
import { X, Plane, Utensils, Zap, ShoppingBag, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCanopyStore } from "@/lib/store"
import {
  TRAVEL_FACTORS,
  FOOD_FACTORS,
  ENERGY_FACTORS,
  SHOPPING_FACTORS,
  TRAVEL_LABELS,
  FOOD_LABELS,
  SHOPPING_LABELS,
  TravelMode,
  FoodType,
  ShoppingType,
} from "@/lib/emission-factors"
import { Activity } from "@/lib/carbon-engine"

const CATEGORIES = [
  { id: "travel" as const,   label: "Travel",   icon: Plane,       tint: "bg-sky/10 text-sky border-sky/20" },
  { id: "food" as const,     label: "Food",     icon: Utensils,    tint: "bg-primary/10 text-forest border-primary/20" },
  { id: "energy" as const,   label: "Energy",   icon: Zap,         tint: "bg-sun/15 text-[#b45309] border-sun/20" },
  { id: "shopping" as const, label: "Shopping", icon: ShoppingBag, tint: "bg-forest/10 text-forest border-forest/20" },
]

export function LogActivityModal() {
  const { logModalOpen, logModalCategory, closeLogModal, logActivity } = useCanopyStore()

  const [category, setCategory] = useState<Activity["category"]>(logModalCategory ?? "travel")
  const [travelMode, setTravelMode] = useState<TravelMode>("metro")
  const [distance, setDistance] = useState("")
  const [foodType, setFoodType] = useState<FoodType>("vegetarian")
  const [meals, setMeals] = useState("1")
  const [kwh, setKwh] = useState("")
  const [shopType, setShopType] = useState<ShoppingType>("online_order")
  const [quantity, setQuantity] = useState("1")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState<number | null>(null)

  if (!logModalOpen) return null

  // Live preview of emissions
  function computePreview(): number {
    switch (category) {
      case "travel": {
        const d = parseFloat(distance)
        if (!isNaN(d) && d > 0) return Math.round(TRAVEL_FACTORS[travelMode] * d * 100) / 100
        return 0
      }
      case "food": {
        const m = parseFloat(meals)
        if (!isNaN(m) && m > 0) return Math.round(FOOD_FACTORS[foodType] * m * 100) / 100
        return 0
      }
      case "energy": {
        const k = parseFloat(kwh)
        if (!isNaN(k) && k > 0) return Math.round(ENERGY_FACTORS.electricity * k * 100) / 100
        return 0
      }
      case "shopping": {
        const q = parseFloat(quantity)
        if (!isNaN(q) && q > 0) return Math.round(SHOPPING_FACTORS[shopType] * q * 100) / 100
        return 0
      }
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    let activity: Activity | null = null

    switch (category) {
      case "travel": {
        const d = parseFloat(distance)
        if (isNaN(d) || d <= 0) { setSubmitting(false); return }
        activity = { category: "travel", mode: travelMode, distance: d }
        break
      }
      case "food": {
        const m = parseFloat(meals)
        if (isNaN(m) || m <= 0) { setSubmitting(false); return }
        activity = { category: "food", type: foodType, meals: m }
        break
      }
      case "energy": {
        const k = parseFloat(kwh)
        if (isNaN(k) || k <= 0) { setSubmitting(false); return }
        activity = { category: "energy", type: "electricity", kwh: k }
        break
      }
      case "shopping": {
        const q = parseFloat(quantity)
        if (isNaN(q) || q <= 0) { setSubmitting(false); return }
        activity = { category: "shopping", type: shopType, quantity: q }
        break
      }
    }

    if (!activity) { setSubmitting(false); return }

    logActivity(activity)
    setSuccess(true)
    setSubmitting(false)

    setTimeout(() => {
      setSuccess(false)
      closeLogModal()
      resetForm()
    }, 1200)
  }

  function resetForm() {
    setDistance("")
    setMeals("1")
    setKwh("")
    setQuantity("1")
    setPreview(null)
    setSuccess(false)
  }

  const emissionPreview = computePreview()

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center" role="dialog" aria-modal>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={closeLogModal}
        aria-hidden
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg animate-rise-in rounded-t-[2rem] border border-border bg-card p-6 shadow-[0_-20px_60px_rgba(16,24,40,0.15)] sm:rounded-[2rem] sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Log Activity</h2>
            <p className="text-sm text-muted-foreground">Track your carbon footprint</p>
          </div>
          <button
            onClick={closeLogModal}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Category tabs */}
        <div className="mb-6 grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-semibold transition-all ${
                category === cat.id
                  ? cat.tint + " scale-[1.02] shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:bg-secondary"
              }`}
            >
              <cat.icon className="h-5 w-5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          {category === "travel" && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Transport mode</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(Object.keys(TRAVEL_LABELS) as TravelMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setTravelMode(mode)}
                      className={`rounded-xl border px-2 py-2 text-xs font-medium transition-all ${
                        travelMode === mode
                          ? "border-primary bg-primary/10 text-forest"
                          : "border-border bg-background text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {TRAVEL_LABELS[mode]}
                    </button>
                  ))}
                </div>
              </div>
              <Field
                label="Distance (km)"
                type="number"
                value={distance}
                onChange={setDistance}
                placeholder="e.g. 12"
                min={0.1}
              />
            </>
          )}

          {category === "food" && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Meal type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(FOOD_LABELS) as FoodType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFoodType(type)}
                      className={`rounded-xl border px-2 py-2 text-xs font-medium transition-all ${
                        foodType === type
                          ? "border-primary bg-primary/10 text-forest"
                          : "border-border bg-background text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {FOOD_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>
              <Field
                label="Number of meals"
                type="number"
                value={meals}
                onChange={setMeals}
                placeholder="1"
                min={1}
                max={10}
              />
            </>
          )}

          {category === "energy" && (
            <Field
              label="Electricity used (kWh)"
              type="number"
              value={kwh}
              onChange={setKwh}
              placeholder="e.g. 5.5"
              min={0.1}
            />
          )}

          {category === "shopping" && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Item type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(SHOPPING_LABELS) as ShoppingType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setShopType(type)}
                      className={`rounded-xl border px-2 py-2 text-xs font-medium transition-all ${
                        shopType === type
                          ? "border-primary bg-primary/10 text-forest"
                          : "border-border bg-background text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {SHOPPING_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>
              <Field
                label="Quantity"
                type="number"
                value={quantity}
                onChange={setQuantity}
                placeholder="1"
                min={1}
              />
            </>
          )}
        </div>

        {/* Emission preview */}
        {emissionPreview > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-secondary px-4 py-3">
            <span className="text-sm font-medium text-muted-foreground">Carbon footprint</span>
            <span className="text-lg font-bold text-forest">{emissionPreview} kg CO₂</span>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || success || emissionPreview <= 0}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : success ? (
            <>
              <Check className="h-4 w-4" /> Logged!
            </>
          ) : (
            "Log Activity"
          )}
        </button>
      </div>
    </div>
  )
}

function Field({ label, type, value, onChange, placeholder, min, max }: {
  label: string; type: string; value: string
  onChange: (v: string) => void; placeholder: string; min?: number; max?: number
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
      />
    </div>
  )
}
