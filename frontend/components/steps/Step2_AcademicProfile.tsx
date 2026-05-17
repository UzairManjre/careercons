"use client"

import { useState, useCallback } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Slider } from "../ui/slider"
import { Select } from "../ui/select"
import { ProfileData } from "@/types"
import { 
  GraduationCap, 
  Sparkles, 
  MapPin, 
  Languages, 
  Award, 
  Heart, 
  Briefcase, 
  CheckCircle,
  HelpCircle,
  TrendingUp
} from "lucide-react"

interface Step2Props {
  onSubmit: (profile: ProfileData) => void
}

const sliderFields = [
  { key: "class10Percentage" as const, label: "CLASS 10 %", min: 0, max: 100, step: 0.1 },
  { key: "class12Percentage" as const, label: "CLASS 12 %", min: 0, max: 100, step: 0.1 },
]

const streams = ["Science", "Commerce", "Arts"] as const

const educationOptions = [
  { value: "10th Pass", label: "10th Pass" },
  { value: "12th Pass", label: "12th Pass" },
  { value: "Pursuing UG", label: "Pursuing UG" },
  { value: "UG Completed", label: "UG Completed" },
  { value: "Pursuing PG", label: "Pursuing PG" },
]

const subjectsList = [
  "Mathematics", "Physics", "Chemistry", "Biology", 
  "Computer Science", "Accountancy", "Economics", 
  "History & Civics", "English", "Psychology"
]

const hobbiesList = [
  "Coding", "Gaming", "Vlogging", 
  "Digital Art", "Writing", "Music", 
  "Debate", "Fitness", "Volunteering"
]

const workStyleOptions = [
  { value: "Independent Researcher", label: "Independent Researcher" },
  { value: "Collaborative Team Player", label: "Collaborative Team Player" },
  { value: "Creative Builder", label: "Creative Builder" },
  { value: "Strategic Leader", label: "Strategic Leader" }
]

const careerValuesList = [
  "High Growth", "Social Impact", 
  "Creative Freedom", "Job Security", 
  "Constant Learning", "Entrepreneurship"
]

const careerWorryOptions = [
  { value: "Wrong Path Fear", label: "Fear of choosing the wrong path" },
  { value: "High Competition", label: "High academic competition" },
  { value: "Parental Pressure", label: "Parental expectations" },
  { value: "Skill Deficit Worry", label: "Lack of practical skills" }
]

export function Step2_AcademicProfile({ onSubmit }: Step2Props) {
  const [profile, setProfile] = useState<ProfileData>({
    class10Percentage: 85,
    stream12: "Science",
    class12Percentage: 80,
    entranceExam: "",
    entranceScore: 0,
    currentEducation: "",
    location: "",
    languages: [],
    extracurricular: [],
    favoriteSubjects: [],
    hobbiesAndInterests: [],
    workStylePreference: "",
    careerValues: [],
    biggestWorry: "",
  })
  const [languageInput, setLanguageInput] = useState("")
  const [extraInput, setExtraInput] = useState("")
  const shouldReduceMotion = useReducedMotion()

  const updateProfile = useCallback(<K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }, [])

  const addLanguage = useCallback(() => {
    const lang = languageInput.trim()
    if (!lang) return
    setProfile((prev) => {
      if (prev.languages.includes(lang)) return prev
      return { ...prev, languages: [...prev.languages, lang] }
    })
    setLanguageInput("")
  }, [languageInput])

  const addExtra = useCallback(() => {
    const act = extraInput.trim()
    if (!act) return
    setProfile((prev) => {
      if (prev.extracurricular.includes(act)) return prev
      return { ...prev, extracurricular: [...prev.extracurricular, act] }
    })
    setExtraInput("")
  }, [extraInput])

  const toggleFavoriteSubject = useCallback((sub: string) => {
    setProfile((prev) => {
      const subs = prev.favoriteSubjects.includes(sub)
        ? prev.favoriteSubjects.filter((s) => s !== sub)
        : [...prev.favoriteSubjects, sub]
      return { ...prev, favoriteSubjects: subs }
    })
  }, [])

  const toggleHobby = useCallback((hobby: string) => {
    setProfile((prev) => {
      const hobbies = prev.hobbiesAndInterests.includes(hobby)
        ? prev.hobbiesAndInterests.filter((h) => h !== hobby)
        : [...prev.hobbiesAndInterests, hobby]
      return { ...prev, hobbiesAndInterests: hobbies }
    })
  }, [])

  const toggleCareerValue = useCallback((val: string) => {
    setProfile((prev) => {
      const vals = prev.careerValues.includes(val)
        ? prev.careerValues.filter((v) => v !== val)
        : [...prev.careerValues, val]
      return { ...prev, careerValues: vals }
    })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto py-6 px-4 space-y-8"
    >
      <div className="text-center mb-10">
        <span className="inline-block text-sm font-mono text-white/40 tracking-[0.25em] uppercase font-bold">
          Step 02 / 04
        </span>
        <h2 className="text-5xl font-display font-bold text-white mt-2 tracking-tight">
          YOUR PROFILE
        </h2>
        <p className="text-sm text-white/50 mt-2 max-w-md mx-auto leading-relaxed">
          Provide your educational background and personal alignment below to unlock custom roadmaps.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* CARD 1: Academic Foundation */}
        <div className="w-full bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-[24px] p-6 md:p-8 shadow-2xl hover:border-white/10 transition-all duration-300 space-y-6">
          <div className="border-b border-white/5 pb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Academic Foundation</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            <div className="space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Class 10 %</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={profile.class10Percentage}
                  onChange={(v) => updateProfile("class10Percentage", v)}
                  min={0}
                  max={100}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-2xl font-black font-mono text-indigo-400 min-w-[70px] text-right tabular-nums">
                  {profile.class10Percentage}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Class 12 %</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={profile.class12Percentage}
                  onChange={(v) => updateProfile("class12Percentage", v)}
                  min={0}
                  max={100}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-2xl font-black font-mono text-indigo-400 min-w-[70px] text-right tabular-nums">
                  {profile.class12Percentage}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Stream (12th)</label>
              <div className="flex gap-2">
                {streams.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateProfile("stream12", s)}
                    className={`flex-1 py-3.5 rounded-xl text-sm font-extrabold transition-all uppercase tracking-wider ${
                      profile.stream12 === s
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                        : "bg-white/5 text-white/50 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Context & Environment */}
        <div className="w-full bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-[24px] p-6 md:p-8 shadow-2xl hover:border-white/10 transition-all duration-300 space-y-6">
          <div className="border-b border-white/5 pb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <MapPin className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Context & Environment</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Current Education</label>
              <Select
                value={profile.currentEducation}
                onChange={(e) => updateProfile("currentEducation", e.target.value)}
                options={educationOptions}
                placeholder="Select..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Entrance Exam</label>
              <Input
                value={profile.entranceExam}
                onChange={(e) => updateProfile("entranceExam", e.target.value)}
                placeholder="e.g. JEE Main, NEET"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Location / Region</label>
              <Input
                value={profile.location}
                onChange={(e) => updateProfile("location", e.target.value)}
                placeholder="e.g. Mumbai"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Languages Spoken</label>
              <div className="flex gap-2">
                <Input
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addLanguage()}
                  placeholder="Languages..."
                />
                <Button variant="outline" onClick={addLanguage} type="button" className="px-4 py-3 shrink-0 text-sm font-bold">ADD</Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1 max-h-16 overflow-y-auto">
                {profile.languages.map((lang) => (
                  <span
                    key={lang}
                    onClick={() => setProfile((prev) => ({ ...prev, languages: prev.languages.filter((l) => l !== lang) }))}
                    className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-lg text-xs font-mono font-bold cursor-pointer hover:bg-indigo-500/25 border border-indigo-500/15"
                  >
                    {lang} ✕
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Interests & Activities */}
        <div className="w-full bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-[24px] p-6 md:p-8 shadow-2xl hover:border-white/10 transition-all duration-300 space-y-6">
          <div className="border-b border-white/5 pb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Interests & Activities</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Extracurriculars</label>
              <div className="flex gap-2">
                <Input
                  value={extraInput}
                  onChange={(e) => setExtraInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addExtra()}
                  placeholder="e.g. coding club, debate"
                />
                <Button variant="outline" onClick={addExtra} type="button" className="px-4 py-3 shrink-0 text-sm font-bold">ADD</Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1 max-h-24 overflow-y-auto">
                {profile.extracurricular.map((act) => (
                  <span
                    key={act}
                    onClick={() => setProfile((prev) => ({ ...prev, extracurricular: prev.extracurricular.filter((e) => e !== act) }))}
                    className="px-3 py-1.5 bg-green-500/10 text-green-300 rounded-lg text-xs font-mono font-bold cursor-pointer hover:bg-green-500/25 border border-green-500/15"
                  >
                    {act} ✕
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Favorite Subjects</label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {subjectsList.map((sub) => {
                  const isActive = profile.favoriteSubjects.includes(sub)
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleFavoriteSubject(sub)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                        isActive
                          ? "bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-500/20"
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {sub}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Hobbies & Passions</label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {hobbiesList.map((hobby) => {
                  const isActive = profile.hobbiesAndInterests.includes(hobby)
                  return (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => toggleHobby(hobby)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                        isActive
                          ? "bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-500/20"
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {hobby}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: Mindset & Blueprint */}
        <div className="w-full bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-[24px] p-6 md:p-8 shadow-2xl hover:border-white/10 transition-all duration-300 space-y-6">
          <div className="border-b border-white/5 pb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Mindset & Blueprint</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Work Style Preference</label>
              <div className="grid grid-cols-1 gap-2">
                {workStyleOptions.map((opt) => {
                  const isActive = profile.workStylePreference === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateProfile("workStylePreference", opt.value)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isActive
                          ? "bg-purple-500/10 text-white border-purple-500 shadow-lg shadow-purple-500/5"
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm font-bold">{opt.label}</span>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${isActive ? "border-purple-400" : "border-white/20"}`}>
                        {isActive && <div className="w-2 h-2 rounded-full bg-purple-400" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Core Career Values</label>
              <div className="flex flex-wrap gap-1.5">
                {careerValuesList.map((val) => {
                  const isActive = profile.careerValues.includes(val)
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => toggleCareerValue(val)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                        isActive
                          ? "bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-500/20"
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {val}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-mono text-white/50 tracking-wider uppercase font-bold">Biggest Career Worry</label>
              <div className="grid grid-cols-1 gap-2">
                {careerWorryOptions.map((opt) => {
                  const isActive = profile.biggestWorry === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateProfile("biggestWorry", opt.value)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isActive
                          ? "bg-purple-500/10 text-white border-purple-500 shadow-lg shadow-purple-500/5"
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm font-bold">{opt.label}</span>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${isActive ? "border-purple-400" : "border-white/20"}`}>
                        {isActive && <div className="w-2 h-2 rounded-full bg-purple-400" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-6 max-w-xs mx-auto"
      >
        <Button 
          size="lg" 
          className="w-full font-black tracking-widest h-14 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all text-white text-base" 
          onClick={() => onSubmit(profile)}
        >
          START ASSESSMENT
        </Button>
      </motion.div>
    </motion.div>
  )
}
