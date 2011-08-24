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

    @Test
    public void tälje() throws Exception {
        Departure target = new Departure("11:11", "Norrtälje S", false, "s");
        assertEquals("should abbreviate 'tälje'", "Norrt:e S", target.getDestination());
    }

    @Test
    public void upplands() throws Exception {
        Departure target = new Departure("11:11", "Upplands Väsby", false, "s");
        assertEquals("should remove starting 'Upplands '", "Väsby", target.getDestination());
    }

    @Test
    public void shouldHandleTwoAbbreviations() throws Exception {
        Departure target = new Departure("11:11", "Södertälje hamn", false, "s");
        assertEquals("should do more than one abbreviation", "Södert:e h", target.getDestination());
    }
}
