package se.cygni.ruhe.sl;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class StationNameTest {
    @Test
    public void hamn() throws Exception {
        StationName target = new StationName("Sutelje hamn");
        assertEquals("should abbreviate 'hamn'", "Sutelje h", target.getShort());
    }

    @Test
    public void väster() throws Exception {
        StationName target = new StationName("Västerhaninge");
        assertEquals("should abbreviate 'väster'", "V:haninge", target.getShort());
    }

    @Test
    public void tälje() throws Exception {
        StationName target = new StationName("Norrtälje S");
        assertEquals("should abbreviate 'tälje'", "Norrt:e S", target.getShort());
    }

    @Test
    public void upplands() throws Exception {
        StationName target = new StationName("Upplands Väsby");
        assertEquals("should remove starting 'Upplands '", "Väsby", target.getShort());
    }

    @Test
    public void central() throws Exception {
        StationName target = new StationName("Allunda Central");
        assertEquals("should abbreviate Central to C", "Allunda C", target.getShort());
    }

    @Test
    public void shouldHandleTwoAbbreviations() throws Exception {
        StationName target = new StationName("Södertälje hamn");
        assertEquals("should do more than one abbreviation", "Södert:e h", target.getShort());
    }
}
