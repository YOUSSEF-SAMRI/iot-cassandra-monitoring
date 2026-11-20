
from fastapi import APIRouter, Request, HTTPException

router = APIRouter(
    prefix="/api/cluster",
    tags=["Cluster Monitoring"]
)


@router.get("/status")
def get_cluster_status(request: Request):

    try:
        session = request.app.state.cassandra
        cluster = session.cluster

        hosts = cluster.metadata.all_hosts()

        nodes = []

        for host in hosts:
            nodes.append({
                "name": host.address,
                "datacenter": host.datacenter,
                "rack": host.rack,
                "status": "UP" if host.is_up else "DOWN"
            })

        total_nodes = len(nodes)

        up_nodes = sum(
            1 for node in nodes
            if node["status"] == "UP"
        )

        down_nodes = total_nodes - up_nodes

        if up_nodes == total_nodes and total_nodes > 0:
            status = "HEALTHY"
        elif up_nodes > 0:
            status = "DEGRADED"
        else:
            status = "DOWN"

        return {
            "cluster_name": cluster.metadata.cluster_name,
            "total_nodes": total_nodes,
            "up_nodes": up_nodes,
            "down_nodes": down_nodes,
            "status": status,
            "nodes": nodes
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Cluster monitoring error: {str(e)}"
        )
