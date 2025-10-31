package com.transroute.logistics.dto;

import java.util.List;

/**
 * DTO para las peticiones de cálculo de distancias
 */
public class DistanceCalculationRequest {
    private List<Double> distances;
    
    // Constructors
    public DistanceCalculationRequest() {}
    
    public DistanceCalculationRequest(List<Double> distances) {
        this.distances = distances;
    }
    
    // Getters and Setters
    public List<Double> getDistances() {
        return distances;
    }
    
    public void setDistances(List<Double> distances) {
        this.distances = distances;
    }
}



