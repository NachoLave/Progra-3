MATCH (r:Route)
RETURN r.id, r.distance, r.cost, r.duration
ORDER BY r.distance;



