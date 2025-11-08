package com.transroute.logistics.dto;

import java.util.List;

/**
 * DTO para peticiones de búsqueda binaria
 */
public class BinarySearchRequest {
    private List<String> centerIds;
    private String searchType; // "demand" o "id"
    private Integer targetDemand;
    private String targetId;
    
    public BinarySearchRequest() {}
    
    public List<String> getCenterIds() {
        return centerIds;
    }
    
    public void setCenterIds(List<String> centerIds) {
        this.centerIds = centerIds;
    }
    
    public String getSearchType() {
        return searchType;
    }
    
    public void setSearchType(String searchType) {
        this.searchType = searchType;
    }
    
    public Integer getTargetDemand() {
        return targetDemand;
    }
    
    public void setTargetDemand(Integer targetDemand) {
        this.targetDemand = targetDemand;
    }
    
    public String getTargetId() {
        return targetId;
    }
    
    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }
}



