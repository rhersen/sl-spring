package se.cygni.ruhe.sl;

import java.util.Collection;
import java.util.Collections;

public class Departures {
    private String updated;
    private String stationName;
    private Collection<Departure> departures;

    public Departures(String updated, String stationName, Collection<Departure> departures) {
        this.updated = updated;
        this.stationName = stationName;
        this.departures = departures;
    }

    public Departures(String updated, String stationName) {
        this.updated = updated;
        this.stationName = stationName;
        this.departures = Collections.emptyList();
    }

    public String getUpdated() {
        return updated;
    }

    public String getStationName() {
        return stationName;
    }

    public Collection<Departure> getDepartures() {
        return departures;
    }

}
