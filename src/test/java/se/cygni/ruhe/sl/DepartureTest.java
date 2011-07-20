package se.cygni.ruhe.sl;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class DepartureTest {
    @Test
    public void hamn() throws Exception {
        Departure target = new Departure("11:11", "Sutelje hamn", false, "s");
        assertEquals("should abbreviate 'hamn'", "Sutelje h", target.getDestination());
    }

    @Test
    public void väster() throws Exception {
        Departure target = new Departure("11:11", "Västerhaninge", false, "s");
        assertEquals("should abbreviate 'väster'", "V:haninge", target.getDestination());
    }
}
