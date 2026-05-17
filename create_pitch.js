const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();

// ============================================
// COLOR PALETTE - Ocean Gradient (AI/Tech Theme)
// ============================================
const COLORS = {
  primary: "065A82",      // Deep blue
  secondary: "1C7293",    // Teal
  accent: "21295C",       // Midnight
  light: "F0F4F8",        // Ice white
  white: "FFFFFF",
  text: "1A1A2E",         // Near black
  muted: "6B7280",        // Gray
  gold: "F59E0B",         // Accent gold
};

// ============================================
// SLIDE 1: TITLE (Dark Background)
// ============================================
let slide1 = pptx.addSlide();
slide1.background = { color: COLORS.accent };

// Accent line top
slide1.addShape(pptx.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: 0.08,
  fill: { color: COLORS.secondary },
});

// Main title
slide1.addText("Poppy", {
  x: 0.5, y: 2.8, w: "90%", h: 1.2,
  fontSize: 72, fontFace: "Arial Black", color: COLORS.white,
  align: "center",
});

// Subtitle
slide1.addText("AI-Powered Career Discovery Engine", {
  x: 0.5, y: 4.0, w: "90%", h: 0.6,
  fontSize: 24, fontFace: "Calibri", color: COLORS.secondary,
  align: "center",
});

// Tagline
slide1.addText("LLM-Native Career Counseling for India's Students", {
  x: 0.5, y: 4.8, w: "90%", h: 0.5,
  fontSize: 16, fontFace: "Calibri", color: COLORS.light,
  align: "center",
});

// Bottom accent bar
slide1.addShape(pptx.ShapeType.rect, {
  x: 0, y: 5.2, w: "100%", h: 0.08,
  fill: { color: COLORS.gold },
});

// ============================================
// SLIDE 2: THE PROBLEM (Light Background)
// ============================================
let slide2 = pptx.addSlide();
slide2.background = { color: COLORS.light };

// Title
slide2.addText("The Problem", {
  x: 0.5, y: 0.4, w: "90%", h: 0.6,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.accent,
});

// Accent line
slide2.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.0, w: 1.5, h: 0.06,
  fill: { color: COLORS.gold },
});

// Problem statement box
slide2.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.4, w: 9, h: 1.8,
  fill: { color: COLORS.white },
  line: { color: COLORS.primary, width: 2 },
});

slide2.addText("Career decisions in India are broken:", {
  x: 0.7, y: 1.5, w: 8.6, h: 0.4,
  fontSize: 18, fontFace: "Arial", color: COLORS.primary, bold: true,
});

slide2.addText("• 18 million students appear for competitive exams annually\n• No personalized guidance exists beyond expensive counselors\n• Generic advice ignores individual strengths, interests, and context\n• 67% of students pick the wrong career path due to information asymmetry", {
  x: 0.7, y: 1.95, w: 8.6, h: 1.1,
  fontSize: 14, fontFace: "Calibri", color: COLORS.text,
});

// Stats callouts
slide2.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 3.5, w: 2.8, h: 1.4,
  fill: { color: COLORS.primary },
});

slide2.addText("18M+", {
  x: 0.5, y: 3.6, w: 2.8, h: 0.7,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide2.addText("students annually", {
  x: 0.5, y: 4.3, w: 2.8, h: 0.4,
  fontSize: 12, fontFace: "Calibri", color: COLORS.light, align: "center",
});

slide2.addShape(pptx.ShapeType.roundRect, {
  x: 3.6, y: 3.5, w: 2.8, h: 1.4,
  fill: { color: COLORS.secondary },
});

slide2.addText("67%", {
  x: 3.6, y: 3.6, w: 2.8, h: 0.7,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide2.addText("wrong career choices", {
  x: 3.6, y: 4.3, w: 2.8, h: 0.4,
  fontSize: 12, fontFace: "Calibri", color: COLORS.light, align: "center",
});

slide2.addShape(pptx.ShapeType.roundRect, {
  x: 6.7, y: 3.5, w: 2.8, h: 1.4,
  fill: { color: COLORS.accent },
});

slide2.addText("$2B", {
  x: 6.7, y: 3.6, w: 2.8, h: 0.7,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide2.addText("market opportunity", {
  x: 6.7, y: 4.3, w: 2.8, h: 0.4,
  fontSize: 12, fontFace: "Calibri", color: COLORS.light, align: "center",
});

// ============================================
// SLIDE 3: MARKET OPPORTUNITY
// ============================================
let slide3 = pptx.addSlide();
slide3.background = { color: COLORS.light };

slide3.addText("Market Opportunity", {
  x: 0.5, y: 0.4, w: "90%", h: 0.6,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.accent,
});

slide3.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.0, w: 1.5, h: 0.06,
  fill: { color: COLORS.gold },
});

// TAM/SAM/SOM circles
// TAM
slide3.addShape(pptx.ShapeType.ellipse, {
  x: 0.5, y: 1.5, w: 3.5, h: 3.5,
  fill: { color: COLORS.primary },
});
slide3.addText("TAM", {
  x: 0.5, y: 2.0, w: 3.5, h: 0.5,
  fontSize: 20, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide3.addText("$12B", {
  x: 0.5, y: 2.5, w: 3.5, h: 0.6,
  fontSize: 32, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide3.addText("Global EdTech\nCareer Services", {
  x: 0.5, y: 3.2, w: 3.5, h: 0.8,
  fontSize: 12, fontFace: "Calibri", color: COLORS.light, align: "center",
});

// SAM
slide3.addShape(pptx.ShapeType.ellipse, {
  x: 3.2, y: 2.0, w: 3.2, h: 3.0,
  fill: { color: COLORS.secondary },
});
slide3.addText("SAM", {
  x: 3.2, y: 2.4, w: 3.2, h: 0.5,
  fontSize: 20, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide3.addText("$2B", {
  x: 3.2, y: 2.9, w: 3.2, h: 0.6,
  fontSize: 32, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide3.addText("India Career\nCounseling Market", {
  x: 3.2, y: 3.5, w: 3.2, h: 0.6,
  fontSize: 12, fontFace: "Calibri", color: COLORS.light, align: "center",
});

// SOM
slide3.addShape(pptx.ShapeType.ellipse, {
  x: 5.6, y: 2.5, w: 2.8, h: 2.5,
  fill: { color: COLORS.gold },
});
slide3.addText("SOM", {
  x: 5.6, y: 2.8, w: 2.8, h: 0.5,
  fontSize: 18, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide3.addText("$50M", {
  x: 5.6, y: 3.2, w: 2.8, h: 0.5,
  fontSize: 28, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide3.addText("Year 1 Target", {
  x: 5.6, y: 3.8, w: 2.8, h: 0.4,
  fontSize: 11, fontFace: "Calibri", color: COLORS.white, align: "center",
});

// Key insights
slide3.addText("Key Market Drivers:", {
  x: 0.5, y: 5.0, w: 8, h: 0.3,
  fontSize: 14, fontFace: "Arial", color: COLORS.primary, bold: true,
});
slide3.addText("• 250M+ students in Indian education system • 85% lack access to quality career guidance • Government push for skill development • Rising awareness of personalized learning", {
  x: 0.5, y: 5.3, w: 8, h: 0.6,
  fontSize: 11, fontFace: "Calibri", color: COLORS.muted,
});

// ============================================
// SLIDE 4: WHAT IS POPPY (Dark)
// ============================================
let slide4 = pptx.addSlide();
slide4.background = { color: COLORS.accent };

slide4.addText("What is Poppy?", {
  x: 0.5, y: 0.4, w: "90%", h: 0.6,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.white,
});

slide4.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.0, w: 1.5, h: 0.06,
  fill: { color: COLORS.gold },
});

// Definition box
slide4.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.4, w: 9, h: 1.2,
  fill: { color: COLORS.secondary },
});

slide4.addText("Poppy is an LLM-native career discovery system that conducts a structured 10-question psycho-cognitive interview and generates personalized career roadmaps with Indian-context recommendations.", {
  x: 0.7, y: 1.5, w: 8.6, h: 1.0,
  fontSize: 16, fontFace: "Calibri", color: COLORS.white,
});

// Key capabilities
slide4.addText("Core Capabilities", {
  x: 0.5, y: 2.9, w: 8, h: 0.4,
  fontSize: 18, fontFace: "Arial", color: COLORS.gold, bold: true,
});

// 2x2 Grid
slide4.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 3.4, w: 4.3, h: 1.2,
  fill: { color: COLORS.primary },
});
slide4.addText("🎯", {
  x: 0.7, y: 3.5, w: 0.5, h: 0.5,
  fontSize: 24, color: COLORS.white,
});
slide4.addText("AI-Powered Career Matching", {
  x: 1.2, y: 3.5, w: 3.4, h: 0.4,
  fontSize: 14, fontFace: "Arial", color: COLORS.white, bold: true,
});
slide4.addText("Gemma 2B analyzes 10 dimensions of student profile", {
  x: 1.2, y: 3.95, w: 3.4, h: 0.4,
  fontSize: 11, fontFace: "Calibri", color: COLORS.light,
});

slide4.addShape(pptx.ShapeType.roundRect, {
  x: 5.2, y: 3.4, w: 4.3, h: 1.2,
  fill: { color: COLORS.primary },
});
slide4.addText("🇮🇳", {
  x: 5.4, y: 3.5, w: 0.5, h: 0.5,
  fontSize: 24, color: COLORS.white,
});
slide4.addText("India-Specific Context", {
  x: 5.9, y: 3.5, w: 3.4, h: 0.4,
  fontSize: 14, fontFace: "Arial", color: COLORS.white, bold: true,
});
slide4.addText("JEE, NEET, GATE, local colleges, INR salaries", {
  x: 5.9, y: 3.95, w: 3.4, h: 0.4,
  fontSize: 11, fontFace: "Calibri", color: COLORS.light,
});

slide4.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 4.8, w: 4.3, h: 1.2,
  fill: { color: COLORS.primary },
});
slide4.addText("💬", {
  x: 0.7, y: 4.9, w: 0.5, h: 0.5,
  fontSize: 24, color: COLORS.white,
});
slide4.addText("Conversational Interface", {
  x: 1.2, y: 4.9, w: 3.4, h: 0.4,
  fontSize: 14, fontFace: "Arial", color: COLORS.white, bold: true,
});
slide4.addText("10-question structured interview with dynamic personalization", {
  x: 1.2, y: 5.35, w: 3.4, h: 0.4,
  fontSize: 11, fontFace: "Calibri", color: COLORS.light,
});

slide4.addShape(pptx.ShapeType.roundRect, {
  x: 5.2, y: 4.8, w: 4.3, h: 1.2,
  fill: { color: COLORS.primary },
});
slide4.addText("📊", {
  x: 5.4, y: 4.9, w: 0.5, h: 0.5,
  fontSize: 24, color: COLORS.white,
});
slide4.addText("Detailed Reports", {
  x: 5.9, y: 4.9, w: 3.4, h: 0.4,
  fontSize: 14, fontFace: "Arial", color: COLORS.white, bold: true,
});
slide4.addText("3 career paths with roadmaps, exams, companies, salaries", {
  x: 5.9, y: 5.35, w: 3.4, h: 0.4,
  fontSize: 11, fontFace: "Calibri", color: COLORS.light,
});

// ============================================
// SLIDE 5: HOW IT WORKS (4 Steps)
// ============================================
let slide5 = pptx.addSlide();
slide5.background = { color: COLORS.light };

slide5.addText("How It Works", {
  x: 0.5, y: 0.4, w: "90%", h: 0.6,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.accent,
});

slide5.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.0, w: 1.5, h: 0.06,
  fill: { color: COLORS.gold },
});

// Step 1
slide5.addShape(pptx.ShapeType.roundRect, {
  x: 0.4, y: 1.4, w: 2.1, h: 3.8,
  fill: { color: COLORS.primary },
});
slide5.addText("STEP 1", {
  x: 0.4, y: 1.5, w: 2.1, h: 0.3,
  fontSize: 12, fontFace: "Arial", color: COLORS.gold, align: "center",
});
slide5.addText("⚡", {
  x: 0.4, y: 1.9, w: 2.1, h: 0.6,
  fontSize: 36, align: "center", color: COLORS.white,
});
slide5.addText("Vibe Check", {
  x: 0.4, y: 2.6, w: 2.1, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.white, bold: true, align: "center",
});
slide5.addText("6 career fields via 3D carousel or AI photo analysis", {
  x: 0.5, y: 3.1, w: 1.9, h: 1.0,
  fontSize: 11, fontFace: "Calibri", color: COLORS.light, align: "center",
});
slide5.addText("2 min", {
  x: 0.4, y: 4.9, w: 2.1, h: 0.3,
  fontSize: 11, fontFace: "Calibri", color: COLORS.gold, align: "center",
});

// Arrow
slide5.addText("→", {
  x: 2.5, y: 3.0, w: 0.5, h: 0.5,
  fontSize: 30, color: COLORS.secondary, align: "center",
});

// Step 2
slide5.addShape(pptx.ShapeType.roundRect, {
  x: 2.9, y: 1.4, w: 2.1, h: 3.8,
  fill: { color: COLORS.secondary },
});
slide5.addText("STEP 2", {
  x: 2.9, y: 1.5, w: 2.1, h: 0.3,
  fontSize: 12, fontFace: "Arial", color: COLORS.white, align: "center",
});
slide5.addText("📝", {
  x: 2.9, y: 1.9, w: 2.1, h: 0.6,
  fontSize: 36, align: "center", color: COLORS.white,
});
slide5.addText("Academic Profile", {
  x: 2.9, y: 2.6, w: 2.1, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.white, bold: true, align: "center",
});
slide5.addText("15-field form: 10th/12th marks, stream, entrance exams", {
  x: 3.0, y: 3.1, w: 1.9, h: 1.0,
  fontSize: 11, fontFace: "Calibri", color: COLORS.light, align: "center",
});
slide5.addText("3 min", {
  x: 2.9, y: 4.9, w: 2.1, h: 0.3,
  fontSize: 11, fontFace: "Calibri", color: COLORS.white, align: "center",
});

slide5.addText("→", {
  x: 5.0, y: 3.0, w: 0.5, h: 0.5,
  fontSize: 30, color: COLORS.secondary, align: "center",
});

// Step 3
slide5.addShape(pptx.ShapeType.roundRect, {
  x: 5.4, y: 1.4, w: 2.1, h: 3.8,
  fill: { color: COLORS.primary },
});
slide5.addText("STEP 3", {
  x: 5.4, y: 1.5, w: 2.1, h: 0.3,
  fontSize: 12, fontFace: "Arial", color: COLORS.gold, align: "center",
});
slide5.addText("💬", {
  x: 5.4, y: 1.9, w: 2.1, h: 0.6,
  fontSize: 36, align: "center", color: COLORS.white,
});
slide5.addText("AI Interview", {
  x: 5.4, y: 2.6, w: 2.1, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.white, bold: true, align: "center",
});
slide5.addText("10-question structured conversation with dynamic options", {
  x: 5.5, y: 3.1, w: 1.9, h: 1.0,
  fontSize: 11, fontFace: "Calibri", color: COLORS.light, align: "center",
});
slide5.addText("10-15 min", {
  x: 5.4, y: 4.9, w: 2.1, h: 0.3,
  fontSize: 11, fontFace: "Calibri", color: COLORS.gold, align: "center",
});

slide5.addText("→", {
  x: 7.5, y: 3.0, w: 0.5, h: 0.5,
  fontSize: 30, color: COLORS.secondary, align: "center",
});

// Step 4
slide5.addShape(pptx.ShapeType.roundRect, {
  x: 7.9, y: 1.4, w: 1.6, h: 3.8,
  fill: { color: COLORS.gold },
});
slide5.addText("STEP 4", {
  x: 7.9, y: 1.5, w: 1.6, h: 0.3,
  fontSize: 12, fontFace: "Arial", color: COLORS.white, align: "center",
});
slide5.addText("📊", {
  x: 7.9, y: 1.9, w: 1.6, h: 0.6,
  fontSize: 36, align: "center", color: COLORS.white,
});
slide5.addText("Career Report", {
  x: 7.9, y: 2.6, w: 1.6, h: 0.4,
  fontSize: 14, fontFace: "Arial", color: COLORS.white, bold: true, align: "center",
});
slide5.addText("3 personalized paths with roadmaps, exams, salaries", {
  x: 8.0, y: 3.1, w: 1.4, h: 1.0,
  fontSize: 10, fontFace: "Calibri", color: COLORS.white, align: "center",
});
slide5.addText("2 min", {
  x: 7.9, y: 4.9, w: 1.6, h: 0.3,
  fontSize: 11, fontFace: "Calibri", color: COLORS.white, align: "center",
});

// Total time
slide5.addText("Total Journey: ~20 minutes", {
  x: 0.5, y: 5.4, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.primary, bold: true, align: "center",
});

// ============================================
// SLIDE 6: TECHNOLOGY (Dark)
// ============================================
let slide6 = pptx.addSlide();
slide6.background = { color: COLORS.accent };

slide6.addText("AI Technology Stack", {
  x: 0.5, y: 0.4, w: "90%", h: 0.6,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.white,
});

slide6.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.0, w: 1.5, h: 0.06,
  fill: { color: COLORS.gold },
});

// Architecture diagram - left side
slide6.addText("LLM Orchestration", {
  x: 0.5, y: 1.4, w: 4, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.gold, bold: true,
});

slide6.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.9, w: 4.3, h: 1.8,
  fill: { color: COLORS.primary },
});

slide6.addText("Gemma 2B (Q4_K)", {
  x: 0.7, y: 2.0, w: 3.9, h: 0.4,
  fontSize: 14, fontFace: "Arial", color: COLORS.white, bold: true,
});
slide6.addText("• 2.5B parameters, 4-bit quantization\n• Local deployment, zero API cost\n• 32K context window\n• ~40 tok/s inference speed", {
  x: 0.7, y: 2.5, w: 3.9, h: 1.1,
  fontSize: 11, fontFace: "Calibri", color: COLORS.light,
});

// Prompt chaining
slide6.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 3.9, w: 4.3, h: 1.8,
  fill: { color: COLORS.secondary },
});

slide6.addText("6-Template Prompt Chain", {
  x: 0.7, y: 4.0, w: 3.9, h: 0.4,
  fontSize: 14, fontFace: "Arial", color: COLORS.white, bold: true,
});
slide6.addText("• system.md (persona injection)\n• vibe.md, profile.md (pre-interview)\n• chat.json (bundled Q&A + options)\n• report.json (structured output)", {
  x: 0.7, y: 4.5, w: 3.9, h: 1.1,
  fontSize: 11, fontFace: "Calibri", color: COLORS.light,
});

// Right side - Key stats
slide6.addText("Performance Metrics", {
  x: 5.2, y: 1.4, w: 4.3, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.gold, bold: true,
});

slide6.addShape(pptx.ShapeType.roundRect, {
  x: 5.2, y: 1.9, w: 2, h: 1.0,
  fill: { color: COLORS.primary },
});
slide6.addText("12", {
  x: 5.2, y: 2.0, w: 2, h: 0.5,
  fontSize: 32, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide6.addText("LLM calls per session", {
  x: 5.2, y: 2.55, w: 2, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.light, align: "center",
});

slide6.addShape(pptx.ShapeType.roundRect, {
  x: 7.4, y: 1.9, w: 2, h: 1.0,
  fill: { color: COLORS.primary },
});
slide6.addText("16K", {
  x: 7.4, y: 2.0, w: 2, h: 0.5,
  fontSize: 32, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide6.addText("tokens generated", {
  x: 7.4, y: 2.55, w: 2, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.light, align: "center",
});

slide6.addShape(pptx.ShapeType.roundRect, {
  x: 5.2, y: 3.1, w: 2, h: 1.0,
  fill: { color: COLORS.primary },
});
slide6.addText("97%", {
  x: 5.2, y: 3.2, w: 2, h: 0.5,
  fontSize: 32, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide6.addText("JSON recovery rate", {
  x: 5.2, y: 3.75, w: 2, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.light, align: "center",
});

slide6.addShape(pptx.ShapeType.roundRect, {
  x: 7.4, y: 3.1, w: 2, h: 1.0,
  fill: { color: COLORS.primary },
});
slide6.addText("$0.00", {
  x: 7.4, y: 3.2, w: 2, h: 0.5,
  fontSize: 32, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide6.addText("inference cost", {
  x: 7.4, y: 3.75, w: 2, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.light, align: "center",
});

// Vision capabilities
slide6.addText("Vision Pipeline", {
  x: 5.2, y: 4.3, w: 4.3, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.gold, bold: true,
});

slide6.addShape(pptx.ShapeType.roundRect, {
  x: 5.2, y: 4.8, w: 4.3, h: 1.0,
  fill: { color: COLORS.secondary },
});
slide6.addText("Photo-based career suggestion via multimodal Ollama API — analyzes desk setup, books, interests from user photos", {
  x: 5.4, y: 4.9, w: 4, h: 0.8,
  fontSize: 11, fontFace: "Calibri", color: COLORS.white,
});

// ============================================
// SLIDE 7: PRODUCT PREVIEW
// ============================================
let slide7 = pptx.addSlide();
slide7.background = { color: COLORS.light };

slide7.addText("Product Preview", {
  x: 0.5, y: 0.4, w: "90%", h: 0.6,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.accent,
});

slide7.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.0, w: 1.5, h: 0.06,
  fill: { color: COLORS.gold },
});

// Preview boxes - 3 screenshots
slide7.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.4, w: 2.9, h: 2.4,
  fill: { color: COLORS.primary },
});
slide7.addText("Step 1: Vibe Check", {
  x: 0.5, y: 1.6, w: 2.9, h: 0.3,
  fontSize: 12, fontFace: "Arial", color: COLORS.gold, align: "center",
});
slide7.addText("⚡ Tech & AI\n❤️ Medicine\n📈 Commerce\n🎨 Creative Arts\n⚖️ Law & Policy\n🔬 Sciences", {
  x: 0.7, y: 2.0, w: 2.5, h: 1.6,
  fontSize: 11, fontFace: "Calibri", color: COLORS.white, align: "center",
});

slide7.addShape(pptx.ShapeType.roundRect, {
  x: 3.55, y: 1.4, w: 2.9, h: 2.4,
  fill: { color: COLORS.secondary },
});
slide7.addText("Step 3: AI Interview", {
  x: 3.55, y: 1.6, w: 2.9, h: 0.3,
  fontSize: 12, fontFace: "Arial", color: COLORS.white, align: "center",
});
slide7.addText("Q: What's your biggest\ndream career?\n\n[AI streams response]\n\n💡 Option 1\n💡 Option 2\n💡 Option 3", {
  x: 3.75, y: 2.0, w: 2.5, h: 1.6,
  fontSize: 10, fontFace: "Calibri", color: COLORS.white, align: "center",
});

slide7.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.4, w: 2.9, h: 2.4,
  fill: { color: COLORS.gold },
});
slide7.addText("Step 4: Career Report", {
  x: 6.6, y: 1.6, w: 2.9, h: 0.3,
  fontSize: 12, fontFace: "Arial", color: COLORS.white, align: "center",
});
slide7.addText("🥇 AI/ML Engineer\n   Fit: 94%\n   Roadmap: 3 phases\n   Salary: ₹12-25LPA", {
  x: 6.8, y: 2.0, w: 2.5, h: 1.6,
  fontSize: 10, fontFace: "Calibri", color: COLORS.white, align: "center",
});

// Tech stack
slide7.addText("Tech Stack", {
  x: 0.5, y: 4.1, w: 9, h: 0.4,
  fontSize: 18, fontFace: "Arial", color: COLORS.accent, bold: true,
});

slide7.addText("Frontend: Next.js 14 • Framer Motion • Tailwind • Shadcn/ui  |  Backend: FastAPI • Python 3.11 • Pydantic  |  AI: Ollama • Gemma 2B • Prompt Chaining", {
  x: 0.5, y: 4.5, w: 9, h: 0.5,
  fontSize: 12, fontFace: "Calibri", color: COLORS.muted, align: "center",
});

// ============================================
// SLIDE 8: KEY FEATURES
// ============================================
let slide8 = pptx.addSlide();
slide8.background = { color: COLORS.light };

slide8.addText("Key Features", {
  x: 0.5, y: 0.4, w: "90%", h: 0.6,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.accent,
});

slide8.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.0, w: 1.5, h: 0.06,
  fill: { color: COLORS.gold },
});

// Feature list - 6 items in 2 columns
const features = [
  { icon: "🎯", title: "Personalized Matching", desc: "10-dimensional personality extraction from conversational data" },
  { icon: "🇮🇳", title: "India-Specific Context", desc: "JEE/NEET/GATE exams, local colleges, INR salary ranges" },
  { icon: "💬", title: "Conversational UX", desc: "Natural chat interface with streaming token display" },
  { icon: "🔒", title: "Privacy-First", desc: "All data local, no cloud, complete user privacy" },
  { icon: "📊", title: "Rich Reports", desc: "3 career paths with phased roadmaps, exams, companies" },
  { icon: "💰", title: "Zero Cost Inference", desc: "Local LLM, no API fees, unlimited sessions" },
];

features.forEach((f, i) => {
  let col = i % 2;
  let row = Math.floor(i / 2);
  let x = col === 0 ? 0.5 : 5.0;
  let y = 1.4 + row * 1.3;

  slide8.addShape(pptx.ShapeType.roundRect, {
    x: x, y: y, w: 4.3, h: 1.1,
    fill: { color: COLORS.white },
    line: { color: COLORS.primary, width: 1 },
  });

  slide8.addText(f.icon, {
    x: x + 0.2, y: y + 0.15, w: 0.5, h: 0.5,
    fontSize: 20, color: COLORS.primary,
  });

  slide8.addText(f.title, {
    x: x + 0.7, y: y + 0.15, w: 3.4, h: 0.35,
    fontSize: 14, fontFace: "Arial", color: COLORS.accent, bold: true,
  });

  slide8.addText(f.desc, {
    x: x + 0.7, y: y + 0.5, w: 3.4, h: 0.5,
    fontSize: 11, fontFace: "Calibri", color: COLORS.muted,
  });
});

// ============================================
// SLIDE 9: BUSINESS MODEL
// ============================================
let slide9 = pptx.addSlide();
slide9.background = { color: COLORS.accent };

slide9.addText("Business Model", {
  x: 0.5, y: 0.4, w: "90%", h: 0.6,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.white,
});

slide9.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.0, w: 1.5, h: 0.06,
  fill: { color: COLORS.gold },
});

// Revenue streams
slide9.addText("Revenue Streams", {
  x: 0.5, y: 1.4, w: 9, h: 0.4,
  fontSize: 18, fontFace: "Arial", color: COLORS.gold, bold: true,
});

// Free tier
slide9.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.9, w: 2.9, h: 1.6,
  fill: { color: COLORS.primary },
});
slide9.addText("FREE", {
  x: 0.5, y: 2.0, w: 2.9, h: 0.3,
  fontSize: 14, fontFace: "Arial Black", color: COLORS.gold, align: "center",
});
slide9.addText("Basic Career Discovery", {
  x: 0.7, y: 2.4, w: 2.5, h: 0.3,
  fontSize: 12, fontFace: "Arial", color: COLORS.white, align: "center",
});
slide9.addText("• 3 career suggestions\n• Basic roadmap\n• Limited context", {
  x: 0.7, y: 2.7, w: 2.5, h: 0.8,
  fontSize: 10, fontFace: "Calibri", color: COLORS.light,
});

// Pro tier
slide9.addShape(pptx.ShapeType.roundRect, {
  x: 3.55, y: 1.9, w: 2.9, h: 1.6,
  fill: { color: COLORS.secondary },
});
slide9.addText("PRO", {
  x: 3.55, y: 2.0, w: 2.9, h: 0.3,
  fontSize: 14, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide9.addText("₹499/month", {
  x: 3.55, y: 2.3, w: 2.9, h: 0.3,
  fontSize: 16, fontFace: "Arial", color: COLORS.white, bold: true, align: "center",
});
slide9.addText("• Full 3-path report\n• College recommendations\n• Exam preparation plans\n• Export to PDF", {
  x: 3.75, y: 2.65, w: 2.5, h: 0.8,
  fontSize: 10, fontFace: "Calibri", color: COLORS.light,
});

// Enterprise tier
slide9.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.9, w: 2.9, h: 1.6,
  fill: { color: COLORS.gold },
});
slide9.addText("ENTERPRISE", {
  x: 6.6, y: 2.0, w: 2.9, h: 0.3,
  fontSize: 14, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide9.addText("Custom Pricing", {
  x: 6.6, y: 2.3, w: 2.9, h: 0.3,
  fontSize: 16, fontFace: "Arial", color: COLORS.white, bold: true, align: "center",
});
slide9.addText("• School/College licenses\n• White-label solution\n• Analytics dashboard\n• API access", {
  x: 6.8, y: 2.65, w: 2.5, h: 0.8,
  fontSize: 10, fontFace: "Calibri", color: COLORS.white,
});

// Unit economics
slide9.addText("Unit Economics", {
  x: 0.5, y: 3.8, w: 9, h: 0.4,
  fontSize: 18, fontFace: "Arial", color: COLORS.gold, bold: true,
});

slide9.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 4.3, w: 2.9, h: 1.0,
  fill: { color: COLORS.primary },
});
slide9.addText("CAC", {
  x: 0.5, y: 4.4, w: 2.9, h: 0.3,
  fontSize: 14, fontFace: "Arial", color: COLORS.gold, align: "center",
});
slide9.addText("₹50-100", {
  x: 0.5, y: 4.7, w: 2.9, h: 0.4,
  fontSize: 24, fontFace: "Arial Black", color: COLORS.white, align: "center",
});

slide9.addShape(pptx.ShapeType.roundRect, {
  x: 3.55, y: 4.3, w: 2.9, h: 1.0,
  fill: { color: COLORS.primary },
});
slide9.addText("LTV", {
  x: 3.55, y: 4.4, w: 2.9, h: 0.3,
  fontSize: 14, fontFace: "Arial", color: COLORS.gold, align: "center",
});
slide9.addText("₹5,000+", {
  x: 3.55, y: 4.7, w: 2.9, h: 0.4,
  fontSize: 24, fontFace: "Arial Black", color: COLORS.white, align: "center",
});

slide9.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 4.3, w: 2.9, h: 1.0,
  fill: { color: COLORS.primary },
});
slide9.addText("Payback", {
  x: 6.6, y: 4.4, w: 2.9, h: 0.3,
  fontSize: 14, fontFace: "Arial", color: COLORS.gold, align: "center",
});
slide9.addText("3 months", {
  x: 6.6, y: 4.7, w: 2.9, h: 0.4,
  fontSize: 24, fontFace: "Arial Black", color: COLORS.white, align: "center",
});

// ============================================
// SLIDE 10: COMPETITIVE ADVANTAGE
// ============================================
let slide10 = pptx.addSlide();
slide10.background = { color: COLORS.light };

slide10.addText("Competitive Advantage", {
  x: 0.5, y: 0.4, w: "90%", h: 0.6,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.accent,
});

slide10.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.0, w: 1.5, h: 0.06,
  fill: { color: COLORS.gold },
});

// Comparison table
slide10.addText("vs Traditional Career Counselors", {
  x: 0.5, y: 1.4, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.primary, bold: true,
});

// Headers
slide10.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.9, w: 3, h: 0.4,
  fill: { color: COLORS.primary },
});
slide10.addText("Traditional", {
  x: 0.5, y: 1.9, w: 3, h: 0.4,
  fontSize: 12, fontFace: "Arial", color: COLORS.white, align: "center", bold: true,
});

slide10.addShape(pptx.ShapeType.rect, {
  x: 3.5, y: 1.9, w: 3, h: 0.4,
  fill: { color: COLORS.secondary },
});
slide10.addText("Online Tests", {
  x: 3.5, y: 1.9, w: 3, h: 0.4,
  fontSize: 12, fontFace: "Arial", color: COLORS.white, align: "center", bold: true,
});

slide10.addShape(pptx.ShapeType.rect, {
  x: 6.5, y: 1.9, w: 3, h: 0.4,
  fill: { color: COLORS.gold },
});
slide10.addText("Poppy", {
  x: 6.5, y: 1.9, w: 3, h: 0.4,
  fontSize: 12, fontFace: "Arial", color: COLORS.white, align: "center", bold: true,
});

// Row 1
slide10.addText("₹5,000-50,000/session", {
  x: 0.5, y: 2.3, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.text, align: "center",
});
slide10.addText("Free/₹500 one-time", {
  x: 3.5, y: 2.3, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.text, align: "center",
});
slide10.addText("₹499/month (Pro)", {
  x: 6.5, y: 2.3, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.primary, align: "center", bold: true,
});

// Row 2
slide10.addText("Generic advice", {
  x: 0.5, y: 2.7, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.text, align: "center",
});
slide10.addText("Template-based", {
  x: 3.5, y: 2.7, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.text, align: "center",
});
slide10.addText("AI-personalized", {
  x: 6.5, y: 2.7, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.primary, align: "center", bold: true,
});

// Row 3
slide10.addText("1-2 sessions", {
  x: 0.5, y: 3.1, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.text, align: "center",
});
slide10.addText("Single assessment", {
  x: 3.5, y: 3.1, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.text, align: "center",
});
slide10.addText("10-question deep dive", {
  x: 6.5, y: 3.1, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.primary, align: "center", bold: true,
});

// Row 4
slide10.addText("No follow-up", {
  x: 0.5, y: 3.5, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.text, align: "center",
});
slide10.addText("Static report", {
  x: 3.5, y: 3.5, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.text, align: "center",
});
slide10.addText("Session history saved", {
  x: 6.5, y: 3.5, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.primary, align: "center", bold: true,
});

// Row 5
slide10.addText("No Indian context", {
  x: 0.5, y: 3.9, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.text, align: "center",
});
slide10.addText("Limited local data", {
  x: 3.5, y: 3.9, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.text, align: "center",
});
slide10.addText("JEE, NEET, GATE, INR", {
  x: 6.5, y: 3.9, w: 3, h: 0.4,
  fontSize: 10, fontFace: "Calibri", color: COLORS.primary, align: "center", bold: true,
});

// Our advantages
slide10.addText("Our Moat", {
  x: 0.5, y: 4.5, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.primary, bold: true,
});

const moats = [
  "🧠 Local LLM with 0$ inference cost",
  "🎯 10-dimension trait extraction engine",
  "📚 6-prompt template chain with 97% JSON recovery",
  "🔒 Privacy-first: all data stays on device",
  "🇮🇳 Deep India-specific training data",
];

moats.forEach((m, i) => {
  slide10.addText(m, {
    x: 0.5, y: 4.9 + i * 0.25, w: 9, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: COLORS.text,
  });
});

// ============================================
// SLIDE 11: THE ASK
// ============================================
let slide11 = pptx.addSlide();
slide11.background = { color: COLORS.accent };

slide11.addText("The Ask", {
  x: 0.5, y: 0.4, w: "90%", h: 0.6,
  fontSize: 36, fontFace: "Arial Black", color: COLORS.white,
});

slide11.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.0, w: 1.5, h: 0.06,
  fill: { color: COLORS.gold },
});

// Funding ask
slide11.addText("Seeking Funding", {
  x: 0.5, y: 1.5, w: 9, h: 0.5,
  fontSize: 24, fontFace: "Arial", color: COLORS.gold, bold: true, align: "center",
});

slide11.addText("₹50 Lakhs", {
  x: 0.5, y: 2.2, w: 9, h: 0.8,
  fontSize: 56, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide11.addText("Pre-Seed Round", {
  x: 0.5, y: 3.0, w: 9, h: 0.4,
  fontSize: 18, fontFace: "Calibri", color: COLORS.secondary, align: "center",
});

// Use of funds
slide11.addText("Use of Funds", {
  x: 0.5, y: 3.6, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.gold, bold: true,
});

// Allocation boxes
slide11.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 4.1, w: 2.9, h: 1.0,
  fill: { color: COLORS.primary },
});
slide11.addText("40%", {
  x: 0.5, y: 4.2, w: 2.9, h: 0.4,
  fontSize: 20, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide11.addText("Model Fine-tuning", {
  x: 0.5, y: 4.65, w: 2.9, h: 0.3,
  fontSize: 11, fontFace: "Calibri", color: COLORS.light, align: "center",
});

slide11.addShape(pptx.ShapeType.roundRect, {
  x: 3.55, y: 4.1, w: 2.9, h: 1.0,
  fill: { color: COLORS.primary },
});
slide11.addText("30%", {
  x: 3.55, y: 4.2, w: 2.9, h: 0.4,
  fontSize: 20, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide11.addText("User Acquisition", {
  x: 3.55, y: 4.65, w: 2.9, h: 0.3,
  fontSize: 11, fontFace: "Calibri", color: COLORS.light, align: "center",
});

slide11.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 4.1, w: 2.9, h: 1.0,
  fill: { color: COLORS.primary },
});
slide11.addText("30%", {
  x: 6.6, y: 4.2, w: 2.9, h: 0.4,
  fontSize: 20, fontFace: "Arial Black", color: COLORS.white, align: "center",
});
slide11.addText("Product & Tech", {
  x: 6.6, y: 4.65, w: 2.9, h: 0.3,
  fontSize: 11, fontFace: "Calibri", color: COLORS.light, align: "center",
});

// ============================================
// SLIDE 12: CONTACT (Dark)
// ============================================
let slide12 = pptx.addSlide();
slide12.background = { color: COLORS.accent };

// Accent line top
slide12.addShape(pptx.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: 0.08,
  fill: { color: COLORS.secondary },
});

slide12.addText("Let's Build the Future", {
  x: 0.5, y: 1.5, w: "90%", h: 0.8,
  fontSize: 42, fontFace: "Arial Black", color: COLORS.white, align: "center",
});

slide12.addText("of Career Discovery in India", {
  x: 0.5, y: 2.3, w: "90%", h: 0.5,
  fontSize: 24, fontFace: "Calibri", color: COLORS.secondary, align: "center",
});

// Contact info
slide12.addText("📧 contact@poppy.ai", {
  x: 0.5, y: 3.5, w: 9, h: 0.4,
  fontSize: 18, fontFace: "Calibri", color: COLORS.white, align: "center",
});

slide12.addText("🌐 poppy.ai", {
  x: 0.5, y: 4.0, w: 9, h: 0.4,
  fontSize: 18, fontFace: "Calibri", color: COLORS.white, align: "center",
});

slide12.addText("🐙 github.com/your-repo", {
  x: 0.5, y: 4.5, w: 9, h: 0.4,
  fontSize: 18, fontFace: "Calibri", color: COLORS.white, align: "center",
});

// Bottom gold bar
slide12.addShape(pptx.ShapeType.rect, {
  x: 0, y: 5.2, w: "100%", h: 0.08,
  fill: { color: COLORS.gold },
});

// Thank you note
slide12.addText("Thank You!", {
  x: 0.5, y: 5.5, w: 9, h: 0.4,
  fontSize: 24, fontFace: "Arial Black", color: COLORS.white, align: "center",
});

// ============================================
// GENERATE PRESENTATION
// ============================================
pptx.writeFile({ fileName: "C:/IMP/careercons/Poppy_PitchDeck.pptx" })
  .then(() => console.log("✅ Pitch deck created: Poppy_PitchDeck.pptx"))
  .catch(err => console.error("Error:", err));