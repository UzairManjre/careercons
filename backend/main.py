from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import session, vibe, profile, chat, report, image_analysis

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(title="Poppy Career Counselor", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(session.router, prefix="/api")
app.include_router(vibe.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(report.router, prefix="/api")
app.include_router(image_analysis.router, prefix="/api")
