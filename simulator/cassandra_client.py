from cassandra.cluster import Cluster
from datetime import datetime , timezone


class CassandraClient:
    
    def __init__(self , contact_points , port = 4042):
        
        self.cluster = Cluster(
            contact_points=contact_points,
            port=port
        )

        self.session = self.cluster.connect()
        self.session.set_keyspace("iot_keyspace")
        
        # Prepare the insertion query
        query = """
            INSERT INTO measurements (
                sensor_id,
                day,
                date,
                value
            )
            VALUES (?, ?, ?, ?)
        """
        
        self.insert_statement = self.session.prepare(query)

        print("Connected to Cassandra cluster!")
        
    def insert_measurement(self, measurement):

        now = datetime.now(timezone.utc)

        self.session.execute(
            self.insert_statement,
            (
                measurement["sensor_id"],
                now.date(),
                now,
                measurement["value"]
            )
        )
    
    def close(self):
        self.cluster.shutdown()
        print("Cassandra connection closed.")