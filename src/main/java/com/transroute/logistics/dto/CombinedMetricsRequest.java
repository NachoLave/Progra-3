package com.transroute.logistics.dto;

import java.util.List;

/**
 * DTO para las peticiones de métricas combinadas
 */
public class CombinedMetricsRequest {
    private List<Double> costs;
    private List<Double> distances;
    
    // Constructors
    public CombinedMetricsRequest() {}
    
    public CombinedMetricsRequest(List<Double> costs, List<Double> distances) {
        this.costs = costs;
        this.distances = distances;
    }
    
    // Getters and Setters
    public List<Double> getCosts() {
        return costs;
    }
    
    public void setCosts(List<Double> costs) {
        this.costs = costs;
    }
    
    public List<Double> getDistances() {
        return distances;
    }
    
    public void setDistances(List<Double> distances) {
        this.distances = distances;
    }
}



