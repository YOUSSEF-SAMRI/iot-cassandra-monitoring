from contextlib import asynccontextmanager
from app.database.cassandra import CassandraConnection

from fastapi import FastAPI ,HTTPException

from app.routers import sensors
from app.routers.cluster import router as cluster_router
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifeSpan(app : FastAPI):
    db = CassandraConnection()
    db.connect()
    
    app.state.cassandra = db.session
    
    yield
    
    db.close()
    
app = FastAPI(
    title= "IoT Monitoring API", 
    description="API for monitoring...",
    version= "1.0.0",
    lifespan=lifeSpan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(sensors.router)
app.include_router(cluster_router)

@app.get("/me")
def root():
    return {
        "wesh aba brader"        
    }
    
@app.get("/health")
def health_check():

    try:
        session = app.state.cassandra

        session.execute("SELECT release_version FROM system.local")

        return {
            "status": "healthy",
            "api": "running",
            "cassandra": "connected"
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "unhealthy",
                "api": "running",
                "cassandra": "disconnected"
            }
        )