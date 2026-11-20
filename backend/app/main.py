from contextlib import asynccontextmanager
from app.database.cassandra import CassandraConnection

from fastapi import FastAPI

from app.routers import sensors



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
app.include_router(sensors.router)

@app.get("/me")
def root():
    return {
        "wesh aba brader"        
    }
