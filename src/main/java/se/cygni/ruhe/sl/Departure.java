package se.cygni.ruhe.sl;

public class Departure {
    private String time;
    private String destination;
    private boolean delayed;
    private String direction;

    public String toString() {
        return time + " " + destination;
    }

    public Departure(String time, String destination, boolean delayed, String direction) {
        this.time = time;
        this.destination = destination;
        this.delayed = delayed;
        this.direction = direction;
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

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
}
