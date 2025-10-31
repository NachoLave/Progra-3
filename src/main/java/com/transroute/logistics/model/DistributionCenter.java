package com.transroute.logistics.model;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.List;

@Node("DistributionCenter")
public class DistributionCenter {
    
    @Id
    private String id;
    
    @Property("name")
    private String name;
    
    @Property("city")
    private String city;
    
    @Property("province")
    private String province;
    
    @Property("demandLevel")
    private Integer demandLevel; // 0-100
    
    @Property("capacity")
    private Integer capacity; // en kg
    
    @Property("currentLoad")
    private Integer currentLoad; // carga actual
    
    @Property("operatingCost")
    private Double operatingCost; // costo operativo por día
    
    @Property("priority")
    private Integer priority; // 1-5 (1 = más alta)
    
    @Property("coordinates")
    private String coordinates; // lat,lng
    
    @Property("status")
    private String status; // ACTIVE, MAINTENANCE, CLOSED
    
    @Relationship(type = "CONNECTED_TO")
    private List<Route> routes;
    
    @Relationship(type = "HAS_TRUCK")
    private List<Truck> trucks;
    
    // Constructors
    public DistributionCenter() {}
    
    public DistributionCenter(String id, String name, String city, String province, 
                           Integer demandLevel, Integer capacity, Double operatingCost, 
                           Integer priority, String coordinates) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.province = province;
        this.demandLevel = demandLevel;
        this.capacity = capacity;
        this.currentLoad = 0;
        this.operatingCost = operatingCost;
        this.priority = priority;
        this.coordinates = coordinates;
        this.status = "ACTIVE";
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }
    
    public Integer getDemandLevel() { return demandLevel; }
    public void setDemandLevel(Integer demandLevel) { this.demandLevel = demandLevel; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public Integer getCurrentLoad() { return currentLoad; }
    public void setCurrentLoad(Integer currentLoad) { this.currentLoad = currentLoad; }
    
    public Double getOperatingCost() { return operatingCost; }
    public void setOperatingCost(Double operatingCost) { this.operatingCost = operatingCost; }
    
    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }
    
    public String getCoordinates() { return coordinates; }
    public void setCoordinates(String coordinates) { this.coordinates = coordinates; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public List<Route> getRoutes() { return routes; }
    public void setRoutes(List<Route> routes) { this.routes = routes; }
    
    public List<Truck> getTrucks() { return trucks; }
    public void setTrucks(List<Truck> trucks) { this.trucks = trucks; }
    
    // Métodos de utilidad
    public Double getUtilizationRate() {
        return capacity > 0 ? (double) currentLoad / capacity : 0.0;
    }
    
    public Boolean isOverloaded() {
        return currentLoad > capacity;
    }
}
