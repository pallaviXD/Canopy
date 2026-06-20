"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCanopyStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { Leaf, ArrowRight, ArrowLeft, ShieldAlert, Sparkles, Trophy, LogIn, CheckCircle } from "lucide-react"
import { TRAVEL_FACTORS, FOOD_FACTORS, INDIAN_WEEKLY_AVERAGE, GLOBAL_WEEKLY_AVERAGE } from "@/lib/emission-factors"
import { signInWithGoogle } from "@/lib/firebase-service"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, setUser, logActivity, startChallenge, recompute } = useCanopyStore()
  
  // Steps: 1 = Questions, 2 = Footprint Estimate, 3 = First Challenge
  const [step, setStep] = useState(1)
  
  // Step 1 State
  const [city, setCity] = useState("Bangalore")
  const [transport, setTransport] = useState<"petrol_car" | "diesel_car" | "electric_car" | "bus" | "metro" | "none">("petrol_car")
  const [diet, setDiet] = useState<"heavy_meat" | "low_meat" | "vegetarian" | "vegan">("vegetarian")
  const [household, setHousehold] = useState(3)
  
  // Computed values
  const [baselineWeekly, setBaselineWeekly] = useState(0)

  // Auth loading state
  const [authLoading, setAuthLoading] = useState(false)

  async function handleGoogleSignIn() {
    setAuthLoading(true)
    const firebaseUser = await signInWithGoogle()
    if (firebaseUser) {
      setUser({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName ?? "User",
        email: firebaseUser.email ?? "",
        photoURL: firebaseUser.photoURL,
        isAuthenticated: true,
      })
    }
    setAuthLoading(false)
  }

  // Calculate baseline emissions based on answers
  const calculateBaseline = () => {
    let travelCo2 = 0
    if (transport === "petrol_car") travelCo2 = TRAVEL_FACTORS.petrol_car * 120 // ~120 km/week
    else if (transport === "diesel_car") travelCo2 = TRAVEL_FACTORS.diesel_car * 120
    else if (transport === "electric_car") travelCo2 = TRAVEL_FACTORS.electric_car * 120
    else if (transport === "bus") travelCo2 = TRAVEL_FACTORS.bus * 80 // ~80 km/week
    else if (transport === "metro") travelCo2 = TRAVEL_FACTORS.metro * 100 // ~100 km/week

    let foodCo2 = 0
    if (diet === "heavy_meat") foodCo2 = (FOOD_FACTORS.beef * 3 + FOOD_FACTORS.chicken * 11) // mixed heavy meat
    else if (diet === "low_meat") foodCo2 = (FOOD_FACTORS.chicken * 6 + FOOD_FACTORS.fish * 3 + FOOD_FACTORS.vegetarian * 5)
    else if (diet === "vegetarian") foodCo2 = FOOD_FACTORS.vegetarian * 14 // 14 vegetarian meals
    else if (diet === "vegan") foodCo2 = FOOD_FACTORS.vegan * 14

    // Energy: Household size electricity baseline
    const energyCo2 = 25 * 0.82 // ~20.5 kg CO2

    // Shopping baseline
    const shoppingCo2 = 4.5 // online orders + occasional clothes

    const total = travelCo2 + foodCo2 + energyCo2 + shoppingCo2
    setBaselineWeekly(Math.round(total * 10) / 10)
    setStep(2)
  }

  // Seed baseline logs and accept challenge
  const handleCompleteOnboarding = () => {
    // 1. Seed travel log
    if (transport !== "none") {
      logActivity({
        category: "travel",
        mode: transport === "petrol_car" || transport === "diesel_car" || transport === "electric_car" || transport === "bus" || transport === "metro" ? transport : "petrol_car",
        distance: 120
      })
    }

    // 2. Seed food log
    if (diet === "heavy_meat" || diet === "low_meat") {
      logActivity({
        category: "food",
        type: "chicken",
        meals: 7
      })
    } else {
      logActivity({
        category: "food",
        type: diet === "vegetarian" ? "vegetarian" : "vegan",
        meals: 14
      })
    }

    // 3. Seed energy log
    logActivity({
      category: "energy",
      type: "electricity",
      kwh: 25
    })

    // 4. Seed shopping log
    logActivity({
      category: "shopping",
      type: "online_order",
      quantity: 3
    })

    // Recommend first challenge
    if (transport === "petrol_car" || transport === "diesel_car") {
      startChallenge("public_transit_twice")
    } else {
      startChallenge("skip_meat_3_meals")
    }

    recompute()
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-950/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-sky-950/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-bold tracking-tight text-lg">Canopy</span>
        </div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Step {step} of 3
        </div>
      </header>

      {/* Main content container */}
      <main className="relative z-10 my-auto max-w-xl mx-auto w-full py-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Let&apos;s build your baseline
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">
                  Answer 4 simple questions about your daily routine to estimate your starting carbon footprint.
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-5 backdrop-blur-md">
                {/* Auth reminder if guest */}
                {!user.isAuthenticated && (
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                    <div className="text-xs text-slate-400">
                      <span className="font-semibold text-emerald-400">Optional:</span> Save your progress automatically with Google
                    </div>
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={authLoading}
                      className="flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      {authLoading ? "Signing in..." : "Google Sign-In"}
                    </button>
                  </div>
                )}

                {/* Question 1: City */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">City you live in</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500 transition"
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>

                {/* Question 2: Primary Transport */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Primary mode of transport</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[
                      { id: "petrol_car", label: "Petrol Car" },
                      { id: "diesel_car", label: "Diesel Car" },
                      { id: "electric_car", label: "EV Car" },
                      { id: "bus", label: "Bus" },
                      { id: "metro", label: "Metro" },
                      { id: "none", label: "Walk / Cycle" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setTransport(opt.id as any)}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition ${
                          transport === opt.id
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                            : "bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Diet Preference */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Dietary preference</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "heavy_meat", label: "Regular Meat eater" },
                      { id: "low_meat", label: "Chicken / Fish only" },
                      { id: "vegetarian", label: "Vegetarian" },
                      { id: "vegan", label: "Vegan" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDiet(opt.id as any)}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition ${
                          diet === opt.id
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                            : "bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 4: Household Size */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Household Size</label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setHousehold(num)}
                        className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${
                          household === num
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                            : "bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        {num === 5 ? "5+" : num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit btn */}
              <button
                onClick={calculateBaseline}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 transition shadow-lg shadow-emerald-500/20"
              >
                Estimate Footprint
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 rounded-full px-3 py-1 text-xs font-semibold">
                  <Sparkles className="h-3 w-3" /> Baseline Calculation Complete
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Your baseline footprint
                </h1>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Based on your transport, diet, and electricity use, we estimated your weekly impact.
                </p>
              </div>

              {/* Big footprint display */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center backdrop-blur-md space-y-6">
                <div>
                  <span className="text-6xl font-black text-white">{baselineWeekly}</span>
                  <span className="text-slate-400 text-xl font-medium ml-1">kg CO₂</span>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">per week</p>
                </div>

                <div className="border-t border-slate-800 pt-6 space-y-4">
                  <p className="text-sm font-semibold text-slate-300">How you compare:</p>

                  <div className="space-y-3">
                    {/* Your Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-400">
                        <span>You</span>
                        <span className="font-bold text-white">{baselineWeekly} kg</span>
                      </div>
                      <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(100, (baselineWeekly / 90) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Indian average bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-400">
                        <span>Indian Average</span>
                        <span>{INDIAN_WEEKLY_AVERAGE} kg</span>
                      </div>
                      <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-755 rounded-full"
                          style={{ width: `${(INDIAN_WEEKLY_AVERAGE / 90) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Global average bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-400">
                        <span>Global Average</span>
                        <span>{GLOBAL_WEEKLY_AVERAGE} kg</span>
                      </div>
                      <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-800 rounded-full"
                          style={{ width: `${(GLOBAL_WEEKLY_AVERAGE / 90) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insight sentence */}
                <p className="text-sm leading-relaxed text-slate-400">
                  {baselineWeekly <= INDIAN_WEEKLY_AVERAGE ? (
                    <span className="text-emerald-400 font-semibold">Fantastic start!</span>
                  ) : (
                    <span>Your starting emissions are slightly above average.</span>
                  )}{" "}
                  Nurturing healthy habits in transport and food choices can easily trim your footprint by up to 20%.
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-1 px-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-bold transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 transition shadow-lg"
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 rounded-full px-3 py-1 text-xs font-semibold">
                  <Trophy className="h-3 w-3" /> First Challenge Recommendation
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Kickstart your habits
                </h1>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  We recommend starting with this simple, high-impact habit adjustment this week.
                </p>
              </div>

              {/* Recommended Challenge Card */}
              <div className="bg-gradient-to-br from-emerald-950/20 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Trophy className="h-32 w-32 text-emerald-400" />
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">
                      {transport === "petrol_car" || transport === "diesel_car"
                        ? "Take Public Transit Twice"
                        : "Skip Meat For 3 Meals"}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {transport === "petrol_car" || transport === "diesel_car"
                        ? "Replace two automobile trips with the bus, auto rickshaw, or metro this week."
                        : "Swap meat for vegetarian or vegan dishes for at least three meals."}
                    </p>
                    
                    <div className="pt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-400">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                        Target: {transport === "petrol_car" || transport === "diesel_car" ? "2 trips" : "3 meals"}
                      </span>
                      <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                        Estimated CO₂ Savings: ~{transport === "petrol_car" || transport === "diesel_car" ? "5.8" : "4.2"} kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">How it works:</span> Accepting this challenge sets up your virtual canopy. Every time you log transit or meat-free meals, your scores rise and your virtual forest grows.
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center justify-center gap-1 px-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-bold transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={handleCompleteOnboarding}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 transition shadow-lg shadow-emerald-500/20"
                >
                  Accept & Enter Canopy
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full text-center text-xs text-slate-500 border-t border-slate-900 pt-4">
        Canopy respects your privacy. All computations happen securely on your device.
      </footer>
    </div>
  )
}
