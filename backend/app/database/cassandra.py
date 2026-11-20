
from cassandra.cluster import Cluster
from app.core.config import settings


class CassandraConnection:

    def __init__(self):
        self.cluster = None
        self.session = None

    def connect(self):
        try:
            self.cluster = Cluster(
                contact_points=[settings.CASSANDRA_HOST],
                port=settings.CASSANDRA_PORT
            )

            self.session = self.cluster.connect()

            self.session.set_keyspace(
                settings.CASSANDRA_KEYSPACE
            )

            print("Connected to Cassandra successfully!")

        except Exception as e:
            print(f"Cassandra connection error: {e}")
            raise

    def close(self):
        if self.cluster:
            self.cluster.shutdown()
            print("Cassandra connection closed.")
