package se.cygni.ruhe.sl;

public class Departure {
    private String time;
    private String destination;
    private boolean delayed;

    public String toString() {
        return time + " " + destination;
    }

    public Departure(String time, String destination, boolean delayed) {
        this.time = time;
        this.destination = destination;
        this.delayed = delayed;
    }

    public String getTime() {
        return time;
    }

    public String getDestination() {
        return destination;
    }

    public boolean isDelayed() {
        return delayed;
    }
}
