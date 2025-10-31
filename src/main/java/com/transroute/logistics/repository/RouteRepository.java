package com.transroute.logistics.repository;

import com.transroute.logistics.model.Route;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends Neo4jRepository<Route, String> {
    
    @Query("MATCH (r:Route) RETURN r ORDER BY r.cost ASC")
    List<Route> findAllOrderedByCost();
    
    @Query("MATCH (r:Route) RETURN r ORDER BY r.distance ASC")
    List<Route> findAllOrderedByDistance();
}

