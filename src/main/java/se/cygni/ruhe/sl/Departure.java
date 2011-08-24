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
        String r = fullDestination;

        if (r.endsWith("amn")) {
            r = r.substring(0, r.length() - 3);
        }

        if (r.startsWith("Väster")) {
            r = "V:" + r.substring(6, r.length());
        }

        if (r.startsWith("Upplands ")) {
            r = r.substring(9, r.length());
        }

        int tälje = r.indexOf("tälje");
        if (tälje != -1) {
            StringBuilder b = new StringBuilder();
            b.append(r.substring(0, tälje));
            b.append("t:e");
            b.append(r.substring(tälje + 5));
            r = b.toString();
        }

        return r;
    }
}
