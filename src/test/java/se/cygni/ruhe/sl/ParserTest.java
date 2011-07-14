package se.cygni.ruhe.sl;

import org.junit.Before;
import org.junit.Test;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collection;
import java.util.Iterator;

import static org.junit.Assert.*;

public class ParserTest {
    @Before
    public void setUp() throws Exception {

    }

    @Test
    public void testInvoke() throws Exception {
        InputStream stream = getClass().getResourceAsStream("/flemingsberg.html");
        Departures parsed = new Parser().parse(new InputStreamReader(stream, "UTF-8"));
        assertEquals("23:18", parsed.getUpdated());
        assertEquals("Flemingsberg", parsed.getStationName());

        Collection<Departure> southbound = parsed.getSouthbound();
        assertEquals(2, southbound.size());
        Iterator<Departure> iterator = southbound.iterator();
        Departure departure = iterator.next();
        assertEquals("23:30", departure.getTime());
        assertEquals("Södertälje hamn", departure.getDestination());
        assertEquals("00:00", iterator.next().getTime());

        Collection<Departure> northbound = parsed.getNorthbound();
        assertEquals(2, northbound.size());
        iterator = northbound.iterator();
        departure = iterator.next();
        assertEquals("23:29", departure.getTime());
        assertEquals("Märsta", departure.getDestination());
        assertEquals("23:59", iterator.next().getTime());
    }

    @Test
    public void shouldHandleResultWithBothBusesAndTrains() throws Exception {
        InputStream stream = getClass().getResourceAsStream("/stuvsta.html");
        Departures parsed = new Parser().parse(new InputStreamReader(stream, "UTF-8"));
        assertEquals("22:10", parsed.getUpdated());
        assertEquals("Stuvsta", parsed.getStationName());

        Collection<Departure> southbound = parsed.getSouthbound();
        assertEquals(2, southbound.size());
        Iterator<Departure> iterator = southbound.iterator();
        Departure departure = iterator.next();
        assertEquals("22:24", departure.getTime());
        assertEquals("Södertälje hamn", departure.getDestination());
        assertEquals("22:54", iterator.next().getTime());

        Collection<Departure> northbound = parsed.getNorthbound();
        assertEquals(2, northbound.size());
        iterator = northbound.iterator();
        departure = iterator.next();
        assertEquals("22:35", departure.getTime());
        assertEquals("Märsta", departure.getDestination());
        assertEquals("23:05", iterator.next().getTime());
    }

    @Test
    public void shouldHandleDelay() throws Exception {
        InputStream stream = getClass().getResourceAsStream("/delay.html");
        Departures parsed = new Parser().parse(new InputStreamReader(stream, "UTF-8"));
        assertEquals("22:26", parsed.getUpdated());
        assertEquals("Huddinge", parsed.getStationName());

        Collection<Departure> southbound = parsed.getSouthbound();
        assertEquals(2, southbound.size());
        Iterator<Departure> iterator = southbound.iterator();
        Departure departure = iterator.next();
        assertTrue(departure.isDelayed());
        assertEquals("22:30", departure.getTime());
        assertEquals("Södertälje hamn", departure.getDestination());
        departure = iterator.next();
        assertEquals("22:57", departure.getTime());
        assertFalse(departure.isDelayed());

        Collection<Departure> northbound = parsed.getNorthbound();
        assertEquals(2, northbound.size());
        iterator = northbound.iterator();
        departure = iterator.next();
        assertEquals("22:32", departure.getTime());
        assertEquals("Märsta", departure.getDestination());
        assertEquals("23:02", iterator.next().getTime());
    }

    @Test
    public void shouldNotCrashIfThereAreNoDepartures() throws Exception {
        InputStream stream = getClass().getResourceAsStream("/no-trains.html");
        Departures parsed = new Parser().parse(new InputStreamReader(stream, "UTF-8"));
        assertEquals("0:50", parsed.getUpdated());
        assertTrue(parsed.getStationName().contains("Stuvsta"));

        Collection<Departure> southbound = parsed.getSouthbound();
        assertEquals(0, southbound.size());

        Collection<Departure> northbound = parsed.getNorthbound();
        assertEquals(0, northbound.size());
    }

    @Test
    public void shouldHandleSpaceInStationName() throws Exception {
        InputStream stream = getClass().getResourceAsStream("/sodra.html");
        Departures parsed = new Parser().parse(new InputStreamReader(stream, "UTF-8"));
        assertEquals("Stockholms södra", parsed.getStationName());
    }

}
