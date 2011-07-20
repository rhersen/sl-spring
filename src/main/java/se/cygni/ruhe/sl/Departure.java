package se.cygni.ruhe.sl;

public class Departure {
    private String time;
    private String fullDestination;
    private boolean delayed;
    private String direction;

    public String toString() {
        return time + " " + fullDestination;
    }

    public Departure(String time, String fullDestination, boolean delayed, String direction) {
        this.time = time;
        this.fullDestination = fullDestination;
        this.delayed = delayed;
        this.direction = direction;
    }

    public String getTime() {
        return time;
    }

    public String getFullDestination() {
        return fullDestination;
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

    public String getDestination() {
        if (fullDestination.endsWith("amn")) {
            return fullDestination.substring(0, fullDestination.length() - 3);
        }

        if (fullDestination.startsWith("Väster")) {
            return "V:" + fullDestination.substring(6, fullDestination.length());
        }

        return fullDestination;
    }
}
