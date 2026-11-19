
# from cassandra_client import CassandraClient

# client = CassandraClient(
#     contact_points=["127.0.0.1"],
#     port=9042
# )

# try:
#     rows = client.session.execute(
#         "SELECT cluster_name, data_center FROM system.local"
#     )

#     for row in rows:
#         print("Cluster:", row.cluster_name)
#         print("Datacenter:", row.data_center)

# finally:
#     client.close()
