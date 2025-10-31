package com.transroute.logistics.model;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;

@Node("Truck")
public class Truck {
    
    @Id
    private String id;
    
    @Property("licensePlate")
    private String licensePlate;
    
    @Property("capacity")
    private Integer capacity; // en kg
    
    @Property("fuelCapacity")
    private Integer fuelCapacity; // en litros
    
    @Property("currentFuel")
    private Integer currentFuel;
    
    @Property("status")
    private String status; // AVAILABLE, IN_TRANSIT, MAINTENANCE
    
    // Constructors
    public Truck() {}
    
    public Truck(String id, String licensePlate, Integer capacity, Integer fuelCapacity) {
        this.id = id;
        this.licensePlate = licensePlate;
        this.capacity = capacity;
        this.fuelCapacity = fuelCapacity;
        this.currentFuel = fuelCapacity;
        this.status = "AVAILABLE";
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public Integer getFuelCapacity() { return fuelCapacity; }
    public void setFuelCapacity(Integer fuelCapacity) { this.fuelCapacity = fuelCapacity; }
    
    public Integer getCurrentFuel() { return currentFuel; }
    public void setCurrentFuel(Integer currentFuel) { this.currentFuel = currentFuel; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

