from pydantic import BaseModel

class ReportRequest(BaseModel):
    session_id: str

class SaveReportRequest(BaseModel):
    session_id: str
    report: dict
