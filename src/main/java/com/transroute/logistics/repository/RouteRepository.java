package com.transroute.logistics.repository;

import com.transroute.logistics.model.Route;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface RouteRepository extends Neo4jRepository<Route, String> {
    
    @Query("MATCH (r:Route) RETURN r ORDER BY r.cost ASC")
    List<Route> findAllOrderedByCost();
    
    @Query("MATCH (r:Route) RETURN r ORDER BY r.distance ASC")
    List<Route> findAllOrderedByDistance();
    
    @Query("MATCH (dc:DistributionCenter)-[:CONNECTED_TO]->(r:Route {id: $routeId}) " +
           "RETURN dc.id LIMIT 1")
    String findFromCenter(String routeId);
    
    @Query("MATCH (r:Route {id: $routeId})-[:CONNECTED_TO]->(dc:DistributionCenter) " +
           "RETURN dc.id LIMIT 1")
    String findToCenter(String routeId);
}

