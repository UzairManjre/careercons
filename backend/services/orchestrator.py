from services.session_store import SessionState, UserModel

PHASE_FOUNDATION = "foundation"
PHASE_DEEP_DIVE = "deep_dive"
PHASE_SYNTHESIS = "synthesis"

FOUNDATION_QUESTIONS = [
    {
        "id": 0,
        "question": "You picked **{field}** — what specifically draws you to it? Was there a moment or experience that sparked your interest?",
        "trait": "motivation",
    },
    {
        "id": 1,
        "question": "Walk me through your academic journey so far. Which subjects did you love? Which ones felt like a struggle?",
        "trait": "academic_mapping",
    },
    {
        "id": 2,
        "question": "Beyond the classroom — what do you spend your time on? Hobbies, side projects, clubs, sports? Anything you've built or been part of?",
        "trait": "extracurricular",
    },
    {
        "id": 3,
        "question": "Picture your ideal workday 10 years from now. What does it look like? Desk or outdoors? Solo deep work or team collaboration? Fast-paced or steady?",
        "trait": "lifestyle",
    },
    {
        "id": 4,
        "question": "Is there someone whose career path you admire — a family member, a teacher, someone you follow online? What about it appeals to you?",
        "trait": "role_models",
    },
    {
        "id": 5,
        "question": "Be honest — what's your biggest fear when it comes to choosing a career? Getting stuck? Picking wrong? Not earning enough?",
        "trait": "concerns",
    },
]

DEEP_DIVE_QUESTIONS = [
    {
        "id": 6,
        "question": "You mentioned **{trait_hint_1}** and **{trait_hint_2}** — based on that, have you ever considered **{suggestion}**? What's your gut reaction?",
        "trait": "path_matching",
    },
    {
        "id": 7,
        "question": "When you imagine your work environment — do you see yourself in a big city corporate office, a small town clinic, a research lab, or working remotely from anywhere?",
        "trait": "work_environment",
    },
    {
        "id": 8,
        "question": "Let's talk priorities. How important is salary vs job satisfaction vs work-life balance vs making a difference? Where do you draw the line?",
        "trait": "values",
    },
    {
        "id": 9,
        "question": "If you could snap your fingers and be guaranteed success in any career — no risk, no exams, no competition — what would you pick?",
        "trait": "aspiration",
    },
]

class Orchestrator:
    def get_current_question(self, session: SessionState, user_answers: dict[int, str]) -> dict | None:
        if session.discovery_phase == PHASE_SYNTHESIS:
            return None

        q_index = session.question_index
        profile = session.profile_data or {}

        # 1. Format profile parameters for dynamic string replacement
        fav_subs_list = profile.get("favorite_subjects", [])
        fav_subs = ", ".join(fav_subs_list)
        
        hobbies_list = profile.get("hobbies_and_interests", [])
        hobbies = ", ".join(hobbies_list)
        
        extracurricular_list = profile.get("extracurricular", [])
        extracurriculars = ", ".join(extracurricular_list)
        
        work_style = profile.get("work_style_preference", "")
        
        vals_list = profile.get("career_values", [])
        career_values = ", ".join(vals_list)

        worry_map = {
            "Wrong Path Fear": "fear of choosing the wrong career path",
            "High Competition": "high academic competition & cutoffs",
            "Parental Pressure": "parental expectation & peer pressure",
            "Skill Deficit Worry": "lack of practical/real-world job skills",
            "No Clear Direction": "not having a clear direction or specific passion"
        }
        raw_worry = profile.get("biggest_worry", "")
        biggest_worry = worry_map.get(raw_worry, raw_worry)

        if session.discovery_phase == PHASE_FOUNDATION:
            if q_index < len(FOUNDATION_QUESTIONS):
                q = dict(FOUNDATION_QUESTIONS[q_index])
                
                # Dynamic personalization based on user profile answers!
                if q["id"] == 0:
                    q["question"] = q["question"].format(field=session.selected_field or "your field")
                elif q["id"] == 1:
                    if fav_subs:
                        q["question"] = f"You mentioned that your favorite subjects are **{fav_subs}**! What specific topics in them fascinated you, and were there any subjects that felt like a major struggle?"
                    else:
                        q["question"] = "Walk me through your academic journey so far. Which subjects did you love? Which ones felt like a struggle?"
                elif q["id"] == 2:
                    if hobbies and extracurriculars:
                        q["question"] = f"Beyond classes, you're into **{hobbies}** and have done extracurriculars like **{extracurriculars}**! Tell me more about a project or activity here that you're most proud of."
                    elif hobbies:
                        q["question"] = f"Beyond classes, you enjoy **{hobbies}**! Tell me more about one of these hobbies or a personal project that you're most proud of."
                    elif extracurriculars:
                        q["question"] = f"Beyond classes, you have been involved in **{extracurriculars}**! Tell me more about an activity or experience here that you're most proud of."
                    else:
                        q["question"] = "Beyond the classroom — what do you spend your time on? Hobbies, side projects, clubs, sports? Anything you've built or been part of?"
                elif q["id"] == 3:
                    if work_style:
                        q["question"] = f"You shared that you prefer a **{work_style}** work style. When you picture your ideal workday 10 years from now, how does that style manifest in your day-to-day tasks?"
                    else:
                        q["question"] = "Picture your ideal workday 10 years from now. What does it look like? Desk or outdoors? Solo deep work or team collaboration? Fast-paced or steady?"
                elif q["id"] == 5:
                    if biggest_worry:
                        q["question"] = f"You mentioned that your biggest worry right now is **{biggest_worry}**. Tell me more about that anxiety. What specific hurdles do you feel are causing this?"
                    else:
                        q["question"] = "Be honest — what's your biggest fear when it comes to choosing a career? Getting stuck? Picking wrong? Not earning enough?"
                
                return q
            else:
                session.discovery_phase = PHASE_DEEP_DIVE
                session.question_index = len(FOUNDATION_QUESTIONS)
                q_index = session.question_index

        if session.discovery_phase == PHASE_DEEP_DIVE:
            idx = q_index - len(FOUNDATION_QUESTIONS)
            if idx < len(DEEP_DIVE_QUESTIONS):
                q = dict(DEEP_DIVE_QUESTIONS[idx])
                
                if q["id"] == 8: # Priority and Values
                    if career_values:
                        q["question"] = f"You prioritized career values like **{career_values}**. How do you see yourself balancing these core values with other priorities like salary, satisfaction, and work-life balance?"
                    else:
                        q["question"] = "Let's talk priorities. How important is salary vs job satisfaction vs work-life balance vs making a difference? Where do you draw the line?"
                else:
                    hints = self._build_trait_hints(session.user_model, user_answers)
                    q["question"] = q["question"].format(**hints)
                
                return q

        return None

    def _build_trait_hints(self, um: UserModel, answers: dict[int, str]) -> dict:
        hint_1 = um.motivation[:60] if um.motivation else "your profile"
        hint_2 = (um.lifestyle_preferences or um.aspiration or "your interests")[:60]
        suggestion = "roles that blend technology with human interaction"
        if um.motivation and ("build" in um.motivation.lower() or "create" in um.motivation.lower()):
            suggestion = "product management or technical project lead roles"
        elif um.motivation and ("help" in um.motivation.lower() or "people" in um.motivation.lower()):
            suggestion = "healthcare, counseling, or social impact careers"
        elif um.motivation and ("money" in um.motivation.lower() or "business" in um.motivation.lower()):
            suggestion = "finance, investment banking, or entrepreneurship"
        return {"trait_hint_1": hint_1, "trait_hint_2": hint_2, "suggestion": suggestion}

    def extract_trait(self, answer: str, trait: str, um: UserModel):
        mapping = {
            "motivation": ("motivation", lambda v: setattr(um, "motivation", v)),
            "academic_mapping": ("academic_mapping", lambda v: None),
            "extracurricular": ("extracurricular", lambda v: None),
            "lifestyle": ("lifestyle_preferences", lambda v: setattr(um, "lifestyle_preferences", v)),
            "role_models": ("role_models", lambda v: setattr(um, "role_models", v)),
            "concerns": ("concerns", lambda v: setattr(um, "concerns", v)),
            "path_matching": ("matched_paths_hints", lambda v: None),
            "work_environment": ("work_environment", lambda v: setattr(um, "work_environment", v)),
            "values": ("values_priority", lambda v: setattr(um, "values_priority", v)),
            "aspiration": ("aspiration", lambda v: setattr(um, "aspiration", v)),
        }
        if trait in mapping:
            _, setter = mapping[trait]
            setter(answer)

    def is_interview_complete(self, session: SessionState) -> bool:
        return session.question_index >= session.total_questions

orchestrator = Orchestrator()
