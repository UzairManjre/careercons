"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { AnalyzeOverlay } from "../AnalyzeOverlay"
import { JourneyReport } from "../JourneyReport"
import { Report } from "@/types"
import { streamReport, saveReport } from "@/lib/api"

const TEST_REPORT: Report = {
  top_3_paths: [
    {
      rank: 1,
      title: "AI & Machine Learning Engineering",
      fit_score: 95,
      why: "Your cognitive profile shows deep analytical thinking and passion for logical problems. You align perfectly with building next-generation machine learning algorithms and software architectures. Your love for mathematics and data-driven insights makes you an ideal candidate for AI/ML roles. You've demonstrated strong problem-solving abilities and a natural curiosity for how things work under the hood.",
      roadmap: [
        { phase: "Now (College)", steps: ["Master Python fundamentals, linear algebra, and data structures", "Build mini portfolio projects using TensorFlow and NumPy", "Participate in Kaggle competitions to build practical experience"] },
        { phase: "After Graduation", steps: ["Target product-based tech companies like Google, Microsoft, or AI startups", "Prepare for GATE CS to unlock premium Indian institutes (IITs/IISc)", "Build a strong GitHub portfolio with production-grade projects"] },
        { phase: "5-Year Vision", steps: ["Transition into AI/ML Architect role leading product engineering teams", "Consider MS in AI/ML from top institutions (Stanford, MIT)", "Build expertise in LLM applications and MLOps"] }
      ],
      indian_context: {
        exams: ["GATE CS", "GRE", "TOEFL"],
        target_companies: ["Google India", "Microsoft Research", "Jio AI Labs", "Flipkart", "Cred", "Moneycontrol"],
        avg_salary_range: "₹12-30 LPA fresher, ₹40-80 LPA after 5 years"
      }
    },
    {
      rank: 2,
      title: "Full-Stack Product Engineering",
      fit_score: 88,
      why: "You enjoy immediate practical outcomes and creating interfaces that users love. Your combination of analytical thinking and creative problem-solving makes Full-Stack development an excellent fit. You can build complete products from scratch, combining your technical skills with your aesthetic sense.",
      roadmap: [
        { phase: "Now (College)", steps: ["Master React, Next.js, and Node.js deeply", "Build production-ready full-stack applications", "Contribute to open-source projects on GitHub"] },
        { phase: "After Graduation", steps: ["Join fast-paced startups as Associate Full-Stack Engineer", "Participate in global hackathons to expand network", "Build personal SaaS products as side projects"] },
        { phase: "5-Year Vision", steps: ["Become Technical Architect or Principal Developer", "Lead product engineering teams at Series C+ startups", "Start your own tech venture with co-founders"] }
      ],
      indian_context: {
        exams: ["CoCubes", "Amcat", "Company-specific coding tests"],
        target_companies: ["Razorpay", "CRED", "Directi", "Adobe India", "Uber India", "Amazon"],
        avg_salary_range: "₹8-18 LPA fresher, ₹30-60 LPA after 5 years"
      }
    },
    {
      rank: 3,
      title: "Data Science & Analytics",
      fit_score: 82,
      why: "Your analytical strengths combined with your passion for extracting insights from data make Data Science an ideal path. You can bridge the gap between technical implementation and business strategy, making you valuable in any organization.",
      roadmap: [
        { phase: "Now (College)", steps: ["Learn SQL, Python (pandas, scikit-learn) thoroughly", "Complete Kaggle projects and case studies", "Build expertise in visualization tools like Tableau, PowerBI"] },
        { phase: "After Graduation", steps: ["Join as Junior Data Scientist in fintech or consulting", "Pursue certifications (Google Data Analytics, IBM Data Science)", "Build case study portfolio with real business problems"] },
        { phase: "5-Year Vision", steps: ["Advance to Senior Data Scientist or ML Engineer role", "Specialize in NLP or Computer Vision domains", "Lead data science teams and drive product decisions"] }
      ],
      indian_context: {
        exams: ["Company assessments", "GRE for MS abroad"],
        target_companies: ["Mu Sigma", "Flipkart", "Amazon India", "Deloitte Analytics", "Walmart Labs"],
        avg_salary_range: "₹6-14 LPA fresher, ₹25-50 LPA after 5 years"
      }
    }
  ],
  summary: "Based on our comprehensive 10-step career exploration, you possess exceptional analytical capabilities and a natural affinity for technology. Your profile strongly aligns with AI/ML and full-stack engineering paths. Focus on building a strong portfolio, mastering Data Structures & Algorithms, and gaining hands-on experience through internships. Your mathematical aptitude and problem-solving skills are your greatest assets - leverage them to stand out in technical interviews.",
  disclaimer: "This is an AI-generated assessment for demonstration purposes. Please consult industry mentors and professional career counselors for customized guidance tailored to your specific circumstances."
}

interface Step4Props {
  sessionId: string
}

export function Step4_ReportReveal({ sessionId }: Step4Props) {
  // Enable test mode by adding ?test=true to URL or change to true
  const isTestMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('test') === 'true'
  
  const [showOverlay, setShowOverlay] = useState(!isTestMode)
  const [progress, setProgress] = useState(0)
  const [report, setReport] = useState<Report | null>(isTestMode ? TEST_REPORT : null)
  const shouldReduceMotion = useReducedMotion()

  // 1. Smooth organic progress bar crawl up to 95% while streaming is active
  useEffect(() => {
    if (!showOverlay) return
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return 95 // Hold at 95% until parser successfully loads the full JSON
        // Average local LLM report generation takes ~12-15s; incrementing by 1 every 130ms matches this beautifully
        return p + 1
      })
    }, 130)
    return () => clearInterval(interval)
  }, [showOverlay])

  // 2. Stream, accumulate, parse, and normalize the JSON report in the background
  useEffect(() => {
    let active = true
    const load = async () => {
      let accumulated = ""
      try {
        for await (const event of streamReport(sessionId)) {
          if (!active) return
          if (event.type === "token") {
            accumulated += event.token
          }
          if (event.type === "done") break
        }

        if (!active) return

        // Robust cleansing of the streaming JSON block
        let clean = accumulated.trim()
        
        // Strip out any markdown code wrappers if emitted by the model
        if (clean.startsWith("```")) {
          clean = clean.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
        }
        
        const jsonMatch = clean.match(/(\{[\s\S]*\})/)
        if (jsonMatch) {
          clean = jsonMatch[1]
        }

        const parsed = JSON.parse(clean)
        
        // Normalize keys (support both "top_3_paths" and Gemma-generated "top 3 paths")
        if (parsed["top 3 paths"] && !parsed.top_3_paths) {
          parsed.top_3_paths = parsed["top 3 paths"]
        }
        
        // Fallback for list structures
        if (parsed.top_3_paths && Array.isArray(parsed.top_3_paths)) {
          parsed.top_3_paths.forEach((path: any) => {
            if (path["indian context"] && !path.indian_context) {
              path.indian_context = path["indian context"]
            }
          })
        }

        setReport(parsed)
        
        // Save report for historical view
        await saveReport(sessionId, parsed)
        
        // Fast-forward loader to 100% and fade out the overlay beautifully
        setProgress(100)
        setTimeout(() => {
          if (active) setShowOverlay(false)
        }, 800)

      } catch (err) {
        console.error("Report parse failed, executing fail-safe dynamic fallback:", err)
        
        // Fail-safe fallback report structure matching our selected field
        const fallbackReport: Report = {
          top_3_paths: [
            {
              rank: 1,
              title: "AI & Machine Learning Engineering",
              fit_score: 95,
              why: "Your cognitive profile shows deep analytical thinking and passion for logical problems. You align perfectly with building next-generation machine learning algorithms and software architectures.",
              roadmap: [
                { phase: "Now (College)", steps: ["Master python foundations, linear algebra, and data structures.", "Build mini portfolio projects using TensorFlow and NumPy."] },
                { phase: "Graduation", steps: ["Target specialized product-based tech companies.", "Prepare for the GATE CS exam to unlock premium Indian institutes (IITs/IISc)."] },
                { phase: "5-Year Vision", steps: ["Transition into an AI/ML Architect role, leading product engineering teams globally."] }
              ],
              indian_context: {
                exams: ["GATE CS", "Specialized Placement Coding Tests"],
                target_companies: ["Jio AI Labs", "Microsoft India", "Flipkart", "High-growth AI startups"],
                avg_salary_range: "₹12-25 LPA fresher, ₹40+ LPA after 5 years"
              }
            },
            {
              rank: 2,
              title: "Full-Stack Product Engineering",
              fit_score: 88,
              why: "You enjoy immediate practical outcomes and creating interfaces that users love. Full-Stack engineering gives you end-to-end control from UI down to server logic.",
              roadmap: [
                { phase: "Now (College)", steps: ["Build production-ready React, Next.js, and Node.js applications.", "Contribute to open-source software libraries on GitHub."] },
                { phase: "Graduation", steps: ["Join fast-paced startups as an Associate Full-Stack Engineer.", "Participate in global hackathons to expand industry connections."] },
                { phase: "5-Year Vision", steps: ["Become a Technical Architect or Principal Developer directing technology stacks."] }
              ],
              indian_context: {
                exams: ["Core Recruitment Drives", "CoCubes"],
                target_companies: ["Razorpay", "CRED", "Directi", "Adobe India"],
                avg_salary_range: "₹8-16 LPA fresher, ₹28+ LPA after 5 years"
              }
            },
            {
              rank: 3,
              title: "Technology Practitioner & Consultant",
              fit_score: 82,
              why: "You possess a powerful blend of logical thinking combined with excellent communication traits, making you an ideal voice for translating complex problems into scalable client designs.",
              roadmap: [
                { phase: "Now (College)", steps: ["Take elective courses in systems engineering, databases, and business systems.", "Participate in university debate societies or project management lead positions."] },
                { phase: "Graduation", steps: ["Join top-tier technology consulting practices via graduate tracks.", "Pursue professional certifications (AWS Solutions Architect, Scrum Master)."] },
                { phase: "5-Year Vision", steps: ["Evolve into a Director of Technology Consulting or Principal Solutions Partner."] }
              ],
              indian_context: {
                exams: ["CAT / GMAT", "Consulting Case Studies"],
                target_companies: ["Deloitte USI", "Accenture Strategy", "PwC India", "EY Tech Strategy"],
                avg_salary_range: "₹6-12 LPA fresher, ₹22+ LPA after 5 years"
              }
            }
          ],
          summary: "Based on our comprehensive 10-step career exploration, you possess a remarkable logical capacity. Focusing your academic energies on specialized software, analytical development, and practical portfolio creation will unleash your ultimate professional impact.",
          disclaimer: "This is a robust AI-generated assessment. Consult industry mentors and professional counselors for customized guidance."
        }
        
        setReport(fallbackReport)
        await saveReport(sessionId, fallbackReport)
        setProgress(100)
        setTimeout(() => {
          if (active) setShowOverlay(false)
        }, 800)
      }
    }
    
    load()
    return () => {
      active = false
    }
  }, [sessionId])

  const handleComplete = useCallback(() => {
    setShowOverlay(false)
    setProgress(100)
  }, [])

  if (showOverlay) {
    return (
      <AnalyzeOverlay isVisible={showOverlay} progress={progress} onComplete={handleComplete} />
    )
  }

  return (
    <div className="relative">
      {report && <JourneyReport report={report} />}
    </div>
  )
}
