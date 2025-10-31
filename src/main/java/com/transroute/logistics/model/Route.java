package com.transroute.logistics.model;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;

@Node("Route")
public class Route {
    
    @Id
    private String id;
    
    @Property("name")
    private String name;
    
    @Property("distance")
    private Double distance; // en km
    
    @Property("cost")
    private Double cost; // costo por viaje
    
    @Property("duration")
    private Integer duration; // en minutos
    
    @Property("fuelConsumption")
    private Double fuelConsumption; // litros por km
    
    @Property("roadType")
    private String roadType; // HIGHWAY, CITY, RURAL
    
    @Property("trafficLevel")
    private Integer trafficLevel; // 1-5 (1 = sin tráfico, 5 = muy congestionado)
    
    @Property("tollCost")
    private Double tollCost; // costo de peajes
    
    @Property("maintenanceCost")
    private Double maintenanceCost; // costo de mantenimiento por km
    
    @Property("status")
    private String status; // ACTIVE, CLOSED, MAINTENANCE
    
    @Property("maxWeight")
    private Integer maxWeight; // peso máximo permitido en kg
    
    @Relationship(type = "CONNECTED_TO")
    private DistributionCenter fromCenter;
    
    @Relationship(type = "CONNECTED_TO")
    private DistributionCenter toCenter;
    
    // Constructors
    public Route() {}
    
    public Route(String id, String name, Double distance, Double cost, Integer duration, 
                Double fuelConsumption, String roadType, Integer trafficLevel, 
                Double tollCost, Double maintenanceCost, Integer maxWeight) {
        this.id = id;
        this.name = name;
        this.distance = distance;
        this.cost = cost;
        this.duration = duration;
        this.fuelConsumption = fuelConsumption;
        this.roadType = roadType;
        this.trafficLevel = trafficLevel;
        this.tollCost = tollCost;
        this.maintenanceCost = maintenanceCost;
        this.maxWeight = maxWeight;
        this.status = "ACTIVE";
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }
    
    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public Double getFuelConsumption() { return fuelConsumption; }
    public void setFuelConsumption(Double fuelConsumption) { this.fuelConsumption = fuelConsumption; }
    
    public String getRoadType() { return roadType; }
    public void setRoadType(String roadType) { this.roadType = roadType; }
    
    public Integer getTrafficLevel() { return trafficLevel; }
    public void setTrafficLevel(Integer trafficLevel) { this.trafficLevel = trafficLevel; }
    
    public Double getTollCost() { return tollCost; }
    public void setTollCost(Double tollCost) { this.tollCost = tollCost; }
    
    public Double getMaintenanceCost() { return maintenanceCost; }
    public void setMaintenanceCost(Double maintenanceCost) { this.maintenanceCost = maintenanceCost; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getMaxWeight() { return maxWeight; }
    public void setMaxWeight(Integer maxWeight) { this.maxWeight = maxWeight; }
    
    public DistributionCenter getFromCenter() { return fromCenter; }
    public void setFromCenter(DistributionCenter fromCenter) { this.fromCenter = fromCenter; }
    
    public DistributionCenter getToCenter() { return toCenter; }
    public void setToCenter(DistributionCenter toCenter) { this.toCenter = toCenter; }
    
    // Métodos de utilidad
    public Double getTotalCost() {
        return cost + tollCost + (distance * maintenanceCost);
    }
    
    public Double getCostPerKm() {
        return distance > 0 ? getTotalCost() / distance : 0.0;
    }
    
    public Double getEfficiency() {
        // Eficiencia basada en distancia, costo y tráfico
        Double efficiency = distance / getTotalCost();
        return efficiency * (6 - trafficLevel); // Penaliza el tráfico
    }
}
