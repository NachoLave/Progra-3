MATCH (dc:DistributionCenter)
RETURN dc.id, dc.name, dc.city, dc.demandLevel, dc.capacity
ORDER BY dc.demandLevel DESC;



