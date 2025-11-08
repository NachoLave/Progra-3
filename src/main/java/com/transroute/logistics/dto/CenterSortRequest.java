package com.transroute.logistics.dto;

import java.util.List;

/**
 * DTO para peticiones de ordenamiento de centros
 */
public class CenterSortRequest {
    private List<String> centerIds;
    private String sortBy; // "demand" o "priority"
    private String algorithm; // "mergesort" o "quicksort"
    
    public CenterSortRequest() {}
    
    public CenterSortRequest(List<String> centerIds, String sortBy, String algorithm) {
        this.centerIds = centerIds;
        this.sortBy = sortBy;
        this.algorithm = algorithm;
    }
    
    public List<String> getCenterIds() {
        return centerIds;
    }
    
    public void setCenterIds(List<String> centerIds) {
        this.centerIds = centerIds;
    }
    
    public String getSortBy() {
        return sortBy;
    }
    
    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }
    
    public String getAlgorithm() {
        return algorithm;
    }
    
    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }
}


