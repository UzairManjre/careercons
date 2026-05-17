"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  Sparkles, 
  ArrowRight, 
  X,
  Upload,
  Wand2,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { FieldCard } from "./FieldCard"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

const fields = [
  { icon: "⚡", title: "TECH & AI", subtitle: "Build the future with code & intelligence", color: "#6366f1" },
  { icon: "❤️", title: "MEDICINE", subtitle: "Heal, care, and advance human health", color: "#ef4444" },
  { icon: "📈", title: "COMMERCE", subtitle: "Drive business, finance & innovation", color: "#22c55e" },
  { icon: "🎨", title: "CREATIVE ARTS", subtitle: "Express, design, and inspire the world", color: "#f59e0b" },
  { icon: "⚖️", title: "LAOL & POLICY", subtitle: "Uphold justice and shape society", color: "#8b5cf6" },
  { icon: "🔬", title: "SCIENCES", subtitle: "Discover, research, and push boundaries", color: "#06b6d4" },
]

interface Carousel3DProps {
  onSelect: (field: string) => void
}

interface AnalysisResult {
  suggested_field: string
  confidence: number
  reasoning: string
  secondary_suggestions: string[]
  should_pursue?: boolean
  pursue_decision?: string
  pursue_explanation?: string
}

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
}

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
}

export function Carousel3D({ onSelect }: Carousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const totalCards = fields.length + 1
  
  const goPrev = useCallback(() => {
    setDirection(-1)
    setActiveIndex((i) => (i - 1 + totalCards) % totalCards)
  }, [totalCards])
  
  const goNext = useCallback(() => {
    setDirection(1)
    setActiveIndex((i) => (i + 1) % totalCards)
  }, [totalCards])

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const idx = Number(e.currentTarget.getAttribute("data-index"))
    if (!isNaN(idx)) {
      if (idx === fields.length) {
        setShowUpload(true)
      } else if (idx === activeIndex) {
        onSelect(fields[idx].title)
      } else {
        setDirection(idx > activeIndex ? 1 : -1)
        setActiveIndex(idx)
      }
    }
  }, [activeIndex, onSelect])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string)
      setAnalysisResult(null)
      setAnalysisError(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!uploadedImage) return
    setIsAnalyzing(true)
    setAnalysisError(null)
    
    try {
      const base64Data = uploadedImage.split(',')[1]
      
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/jpeg' })
      
      const formData = new FormData()
      formData.append('file', blob, 'upload.jpg')
      
      const response = await fetch('http://localhost:8000/api/analyze-image', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Analysis failed' }))
        throw new Error(errorData.detail || 'Analysis failed')
      }
      
      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Image analysis error:', error)
      setAnalysisError(error instanceof Error ? error.message : 'Image analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }, [uploadedImage])

  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null)
    setAnalysisResult(null)
    setAnalysisError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleUseSuggestion = useCallback(() => {
    if (analysisResult?.suggested_field) {
      onSelect(analysisResult.suggested_field)
    }
  }, [analysisResult, onSelect])

  const handleBackToCarousel = useCallback(() => {
    setShowUpload(false)
    setUploadedImage(null)
    setAnalysisResult(null)
    setAnalysisError(null)
  }, [])

  const isUploadCard = activeIndex === fields.length

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {!showUpload ? (
        <>
          {/* Main carousel area */}
          <div className="relative w-full h-[250px] flex items-center justify-center overflow-visible">
            <AnimatePresence mode="sync" custom={direction}>
              {fields.map((field, i) => (
                i === activeIndex && (
                  <motion.div
                    key={field.title}
                    custom={direction}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={shouldReduceMotion ? { duration: 0 } as const : springTransition}
                    className="absolute w-full max-w-[500px] h-[150px]"
                  >
                    <FieldCard
                      data-index={i}
                      icon={field.icon}
                      title={field.title}
                      subtitle={field.subtitle}
                      color={field.color}
                      isActive={i === activeIndex}
                      onClick={handleCardClick}
                      style={{
                        position: 'relative',
                        left: 'auto',
                        transform: 'none',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </motion.div>
                )
              ))}
              {/* Upload card */}
              {isUploadCard && (
                <motion.div
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={shouldReduceMotion ? { duration: 0 } : springTransition}
                  className="absolute w-full max-w-[500px] h-[150px]"
                >
                  <FieldCard
                    data-index={fields.length}
                    icon={<Camera className="w-6 h-6" />}
                    title="NOT SURE?"
                    subtitle="Upload a photo and let AI discover your interests"
                    color="#8b5cf6"
                    isActive={isUploadCard}
                    onClick={handleCardClick}
                    style={{
                      position: 'relative',
                      left: 'auto',
                      transform: 'none',
                      width: '100%',
                      height: '100%',
                    }}
                    isUploadCard
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6 mt-8">
            <button
              onClick={goPrev}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
            
            <div className="flex items-center gap-2">
              {fields.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > activeIndex ? 1 : -1)
                    setActiveIndex(i)
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex 
                      ? "w-8 bg-gradient-to-r from-indigo-500 to-violet-500" 
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
              <button
                onClick={() => {
                  setDirection(1)
                  setActiveIndex(fields.length)
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isUploadCard 
                    ? "w-8 bg-gradient-to-r from-indigo-500 to-violet-500" 
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            </div>

            <button
              onClick={goNext}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Select button */}
          <motion.div 
            className="mt-8"
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {!isUploadCard ? (
              <Button
                size="xl"
                onClick={() => onSelect(fields[activeIndex].title)}
                className="px-10 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
              >
                Select {fields[activeIndex].title}
                <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2} />
              </Button>
            ) : (
              <Button
                size="xl"
                onClick={() => setShowUpload(true)}
                className="px-10 py-4 text-base font-semibold rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white transition-all"
              >
                <Camera className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Upload Photo
              </Button>
            )}
          </motion.div>

          {/* Page indicator */}
          <div className="mt-6 flex items-center gap-2 text-white/40 text-sm">
            <span>{activeIndex + 1}</span>
            <span className="w-px h-3 bg-white/20" />
            <span>{totalCards}</span>
          </div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center"
            >
              <Wand2 className="w-8 h-8 text-indigo-400" strokeWidth={1.5} />
            </motion.div>
            <h3 className="text-2xl font-semibold text-white">Discover Your Path</h3>
            <p className="mt-2 text-white/50 text-sm">
              Upload a photo of your space — your desk, books, or anything that defines you.
            </p>
          </div>

          {/* Upload area */}
          <div className="relative">
            {!uploadedImage ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 rounded-2xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all group"
              >
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Upload className="w-7 h-7 text-white/40 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
                </motion.div>
                <div className="text-center">
                  <p className="text-white/80 font-medium">Click to upload</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-64 rounded-2xl overflow-hidden"
              >
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </motion.div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Error display */}
          <AnimatePresence>
            {analysisError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-red-300 text-sm font-medium">Analysis Failed</p>
                  <p className="text-red-400/70 text-xs mt-1">{analysisError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis result */}
          <AnimatePresence>
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-6 rounded-2xl bg-white/[0.03] border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-green-400" strokeWidth={2} />
                  </div>
                  <h4 className="text-white font-semibold">AI Recommendation</h4>
                </div>
                
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {analysisResult.reasoning}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-sm font-medium">
                      {analysisResult.suggested_field}
                    </span>
                    <span className="text-white/40 text-sm">
                      {Math.round(analysisResult.confidence * 100)}% match
                    </span>
                  </div>
                </div>

                {analysisResult.pursue_decision && (
                  <div className={`mt-4 p-4 rounded-xl border ${
                    analysisResult.should_pursue 
                      ? "bg-green-500/10 border-green-500/20" 
                      : "bg-amber-500/10 border-amber-500/20"
                  }`}>
                    <div className="flex items-center gap-2">
                      {analysisResult.should_pursue ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" strokeWidth={2} />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400" strokeWidth={2} />
                      )}
                      <span className={`text-sm font-medium ${
                        analysisResult.should_pursue ? "text-green-300" : "text-amber-300"
                      }`}>
                        {analysisResult.pursue_decision}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs mt-2">
                      {analysisResult.pursue_explanation}
                    </p>
                  </div>
                )}

                {analysisResult.secondary_suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                    <span className="text-white/40 text-xs">Also consider:</span>
                    {analysisResult.secondary_suggestions.map((field) => (
                      <Badge key={field} variant="outline" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleUseSuggestion}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-medium"
                >
                  Use This Recommendation
                  <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleBackToCarousel}
              className="flex-1 py-3 rounded-xl border-white/10 text-white/60 hover:text-white hover:bg-white/5"
            >
              Back
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={!uploadedImage || isAnalyzing}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-medium disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" strokeWidth={2} />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}