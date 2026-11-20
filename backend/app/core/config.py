
import os
from pathlib import Path
from dotenv import load_dotenv

# Locate backend/.env
BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")

class Settings:
    CASSANDRA_HOST: str = os.getenv(
        "CASSANDRA_HOST", "127.0.0.1"
    )

    CASSANDRA_PORT: int = int(
        os.getenv("CASSANDRA_PORT", "9042")
    )

    CASSANDRA_KEYSPACE: str = os.getenv(
        "CASSANDRA_KEYSPACE", "iot_keyspace"
    )


settings = Settings()
