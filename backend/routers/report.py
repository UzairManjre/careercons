from fastapi import APIRouter, HTTPException
from starlette.responses import StreamingResponse
from schemas.report import ReportRequest, SaveReportRequest
from services.session_store import session_store
from services.ollama_client import ollama
from services.prompt_manager import prompt_manager
from services.orchestrator import orchestrator, PHASE_SYNTHESIS
from config import settings
import json

router = APIRouter()

@router.post("/report/generate")
async def generate_report(body: ReportRequest):
    session = session_store.get(body.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # If report already exists (historical or pre-generated sandbox dummy), return it instantly
    if session.report:
        async def event_stream_cached():
            yield f"data: {json.dumps({'type': 'token', 'token': json.dumps(session.report)})}\n\n"
            yield f"data: {json.dumps({'type': 'done', 'done': True})}\n\n"
        return StreamingResponse(event_stream_cached(), media_type="text/event-stream")

    if session.discovery_phase != PHASE_SYNTHESIS:
        raise HTTPException(status_code=400, detail="Discovery interview not complete")

    all_answers = "\n\n".join(
        f"Q{k}: {v}" for k, v in sorted(session.answers.items())
    )

    um = session.user_model
    user_model_summary = (
        f"Motivation: {um.motivation}\n"
        f"Lifestyle preference: {um.lifestyle_preferences}\n"
        f"Role models: {um.role_models}\n"
        f"Concerns: {um.concerns}\n"
        f"Work environment: {um.work_environment}\n"
        f"Values priority: {um.values_priority}\n"
        f"Aspiration: {um.aspiration}\n"
    )

    system_prompt = prompt_manager.render("report_generation",
        field=session.selected_field or "",
        profile=json.dumps(session.profile_data, indent=2) if session.profile_data else "{}",
        all_answers=all_answers,
        user_model=user_model_summary,
    )

    async def event_stream():
        full = ""
        async for token in ollama.generate_stream(
            messages=[],
            system=system_prompt,
            num_predict=settings.num_predict_report,
            format="json",
        ):
            full += token
            yield f"data: {json.dumps({'type': 'token', 'token': token})}\n\n"
        yield f"data: {json.dumps({'type': 'done', 'done': True})}\n\n"
        session_store.update(body.session_id, current_step=4)

    return StreamingResponse(event_stream(), media_type="text/event-stream")

@router.post("/report/save")
async def save_report(body: SaveReportRequest):
    """Save the generated report to session for historical access"""
    session = session_store.get(body.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session_store.update(body.session_id, report=body.report)
    
    return {"status": "saved", "session_id": body.session_id}

@router.get("/report/history")
async def get_report_history():
    """Get all saved reports across sessions"""
    sessions = session_store._sessions
    history = []
    
    for sid, session in sessions.items():
        if session.report:
            history.append({
                "session_id": sid,
                "selected_field": session.selected_field,
                "created_at": session.created_at.isoformat(),
                "report": session.report
            })
    
    # Sort by creation date, newest first
    history.sort(key=lambda x: x["created_at"], reverse=True)
    
    return {"reports": history}

@router.get("/report/test")
async def get_test_report():
    """Get a test/dummy report for UI testing"""
    return {
        "session_id": "test-session",
        "selected_field": "TECH & AI",
        "report": {
            "top_3_paths": [
                {
                    "rank": 1,
                    "title": "AI & Machine Learning Engineering",
                    "fit_score": 95,
                    "why": "Your cognitive profile shows deep analytical thinking and passion for logical problems. You align perfectly with building next-generation machine learning algorithms and software architectures. Your love for mathematics and data-driven insights makes you an ideal candidate for AI/ML roles.",
                    "roadmap": [
                        { "phase": "Now (College)", "steps": ["Master Python fundamentals, linear algebra, and data structures", "Build mini portfolio projects using TensorFlow and NumPy", "Participate in Kaggle competitions"] },
                        { "phase": "After Graduation", "steps": ["Target product-based tech companies like Google, Microsoft, or AI startups", "Prepare for GATE CS to unlock premium Indian institutes (IITs/IISc)", "Build a strong GitHub portfolio with production projects"] },
                        { "phase": "5-Year Vision", "steps": ["Transition into AI/ML Architect role leading product engineering teams", "Consider MS in AI/ML from top institutions", "Build expertise in LLM applications and MLOps"] }
                    ],
                    "indian_context": {
                        "exams": ["GATE CS", "GRE", "TOEFL"],
                        "target_companies": ["Google India", "Microsoft Research", "Jio AI Labs", "Flipkart", "Cred", "Moneycontrol"],
                        "avg_salary_range": "₹12-30 LPA (fresher), ₹40-80 LPA (5+ years)"
                    }
                },
                {
                    "rank": 2,
                    "title": "Full-Stack Product Engineering",
                    "fit_score": 88,
                    "why": "You enjoy immediate practical outcomes and creating interfaces that users love. Your combination of analytical thinking and creative problem-solving makes Full-Stack development an excellent fit. You can build complete products from scratch.",
                    "roadmap": [
                        { "phase": "Now (College)", "steps": ["Master React, Next.js, and Node.js", "Build production-ready full-stack applications", "Contribute to open-source projects on GitHub"] },
                        { "phase": "After Graduation", "steps": ["Join fast-paced startups as Associate Full-Stack Engineer", "Participate in global hackathons", "Build personal SaaS products"] },
                        { "phase": "5-Year Vision", "steps": ["Become Technical Architect or Principal Developer", "Lead product engineering teams", "Start your own tech venture"] }
                    ],
                    "indian_context": {
                        "exams": ["CoCubes", "Amcat", "Company-specific coding tests"],
                        "target_companies": ["Razorpay", "CRED", "Directi", "Adobe India", "Uber India", "Amazon"],
                        "avg_salary_range": "₹8-18 LPA (fresher), ₹30-60 LPA (5+ years)"
                    }
                },
                {
                    "rank": 3,
                    "title": "Data Science & Analytics",
                    "fit_score": 82,
                    "why": "Your analytical strengths combined with your passion for extracting insights from data make Data Science an ideal path. You can bridge the gap between technical implementation and business strategy.",
                    "roadmap": [
                        { "phase": "Now (College)", "steps": ["Learn SQL, Python (pandas, scikit-learn)", "Complete Kaggle projects and case studies", "Build expertise in visualization tools like Tableau"] },
                        { "phase": "After Graduation", "steps": ["Join as Junior Data Scientist in fintech/consulting", "Pursue certifications (Google Data Analytics, IBM)", "Build case study portfolio"] },
                        { "phase": "5-Year Vision", "steps": ["Advance to Senior Data Scientist or ML Engineer", "Specialize in NLP or Computer Vision", "Lead data science teams"] }
                    ],
                    "indian_context": {
                        "exams": ["Company assessments", "GRE for MS"],
                        "target_companies": ["Mu Sigma", "Flipkart", "Amazon India", " Deloitte Analytics", "Walmart Labs"],
                        "avg_salary_range": "₹6-14 LPA (fresher), ₹25-50 LPA (5+ years)"
                    }
                }
            ],
            "summary": "Based on our comprehensive 10-step career exploration, you possess exceptional analytical capabilities and a natural affinity for technology. Your profile strongly aligns with AI/ML and full-stack engineering paths. Focus on building a strong portfolio, mastering Data Structures & Algorithms, and gaining hands-on experience through internships. Your mathematical aptitude and problem-solving skills are your greatest assets.",
            "disclaimer": "This is an AI-generated assessment for demonstration purposes. Please consult industry mentors and professional career counselors for customized guidance tailored to your specific circumstances."
        }
    }

@router.post("/report/inject_dummy")
async def inject_dummy_report():
    """Inject a pre-generated high-fidelity dummy report into a sandbox session"""
    sid = "sandbox-dummy-session"
    test_data = await get_test_report()
    session_store.update(sid,
        current_step=4,
        selected_field="TECH & AI",
        discovery_phase=PHASE_SYNTHESIS,
        report=test_data["report"]
    )
    return {"status": "success", "session_id": sid}
