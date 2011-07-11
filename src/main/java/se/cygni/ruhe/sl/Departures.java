package se.cygni.ruhe.sl;

import java.util.ArrayDeque;
import java.util.Collection;

public class Departures {
    private String updated;
    private String stationName;
    private Collection<Departure> southbound;
    private Collection<Departure> northbound;
    private Collection<Departure> departures;

    public Departures(String updated, String stationName, Collection<Departure> northbound,
                      Collection<Departure> southbound) {
        this.updated = updated;
        this.stationName = stationName;
        this.northbound = northbound;
        this.southbound = southbound;
        Collection<Departure> r = new ArrayDeque<Departure>();
        r.addAll(northbound);
        r.addAll(southbound);
        this.departures = r;
    }

    public String getUpdated() {
        return updated;
    }

    public String getStationName() {
        return stationName;
    }

    public Collection<Departure> getSouthbound() {
        return southbound;
    }

    public Collection<Departure> getNorthbound() {
        return northbound;
    }

    public Collection<Departure> getDepartures() {
        return departures;
    }

}
