package se.cygni.ruhe.sl;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StationName {

    public static final Pattern HAMN = Pattern.compile("(.*)amn");
    public static final Pattern WEST = Pattern.compile("(V)äster(.*)");
    public static final Pattern UPPLAND = Pattern.compile("Upplands (.*)");
    public static final Pattern TELJE = Pattern.compile("(.*)älj(.*)");
    public static final Pattern CENTRAL = Pattern.compile("(.*)entral");

    public String getFull() {
        return full;
    }

    private final String full;

    public StationName(String full) {
        this.full = full;
    }

    public String getShort() {
        String r = remove(full, HAMN);
        r = replace(r, WEST);
        r = remove(r, UPPLAND);
        r = replace(r, TELJE);
        r = remove(r, CENTRAL);
        return r;
    }

    private String remove(String r, Pattern pattern) {
        Matcher matcher = pattern.matcher(r);
        if (matcher.matches()) {
            return matcher.group(1);
        }
        return r;
    }

    private String replace(String r, Pattern pattern) {
        Matcher matcher = pattern.matcher(r);
        if (matcher.matches()) {
            return matcher.group(1) + ":" + matcher.group(2);
        }
        return r;
    }
}
