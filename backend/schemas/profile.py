from pydantic import BaseModel, Field

class ProfileRequest(BaseModel):
    session_id: str
    class_10_percentage: float = Field(ge=0, le=100)
    class_12_stream: str
    class_12_percentage: float = Field(ge=0, le=100)
    entrance_exam: str
    entrance_score: float
    current_education: str
    college: str | None = None
    location: str
    languages: list[str]
    extracurricular: list[str] = []
    favorite_subjects: list[str] = []
    hobbies_and_interests: list[str] = []
    work_style_preference: str = ""
    career_values: list[str] = []
    biggest_worry: str = ""
