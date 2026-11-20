
from cassandra.cluster import Cluster


class CassandraConnection:

    def __init__(self):
        self.cluster = None
        self.session = None

    def connect(self):
        try:
            self.cluster = Cluster(
                contact_points=["127.0.0.1"],
                port=9042
            )

            self.session = self.cluster.connect()

            self.session.set_keyspace("iot_keyspace")

            print("Connected to Cassandra successfully!")

        except Exception as e:
            print(f"Cassandra connection error: {e}")
            raise

    def close(self):
        if self.cluster:
            self.cluster.shutdown()
            print("Cassandra connection closed.")
