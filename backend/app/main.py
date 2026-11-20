
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.database.cassandra import CassandraConnection
from app.routers import sensors


@asynccontextmanager
async def lifespan(app: FastAPI):

    db = CassandraConnection()
    db.connect()

    app.state.cassandra = db.session

    yield

    db.close()


app = FastAPI(
    title="IoT Monitoring API",
    lifespan=lifespan
)

app.include_router(sensors.router)


@app.get("/")
def root():
    return {"message": "Welcome to IoT Monitoring API"}
