package se.cygni.ruhe.sl;

import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collection;
import java.util.Iterator;

import static org.junit.Assert.*;

public class ParserTest {

    private Parser target;

    @Before
    public void setUp() throws Exception {
        target = new Parser();
    }

    @Test
    public void testInvoke() throws Exception {
        Departures result = testParse("flemingsberg.html");
        assertEquals("23:18", result.getUpdated());
        assertEquals("Flemingsberg", result.getStationName());
        Collection<Departure> departures = result.getDepartures();
        assertEquals(4, departures.size());
        Iterator<Departure> iterator = departures.iterator();
        Departure departure = findNorthbound(iterator);
        assertEquals("Märsta", departure.getDestination());
        assertEquals("23:29", departure.getTime());
        assertEquals("23:59", iterator.next().getTime());
    }

    @Test
    public void shouldHandleResultWithBothBusesAndTrains() throws Exception {
        Departures result = testParse("stuvsta.html");
        assertEquals("22:10", result.getUpdated());
        assertEquals("Stuvsta", result.getStationName());
        Collection<Departure> departures = result.getDepartures();
        assertEquals(4, departures.size());
        Iterator<Departure> iterator = departures.iterator();
        Departure departure = findNorthbound(iterator);
        assertEquals("22:35", departure.getTime());
        assertEquals("Märsta", departure.getDestination());
        assertEquals("23:05", iterator.next().getTime());
    }

    @Test
    public void shouldHandleDelay() throws Exception {
        Departures result = testParse("delay.html");
        assertEquals("22:26", result.getUpdated());
        assertEquals("Huddinge", result.getStationName());
        Collection<Departure> departures = result.getDepartures();
        assertEquals(4, departures.size());
        Iterator<Departure> iterator = departures.iterator();
        Departure departure = findNorthbound(iterator);
        assertEquals("22:32", departure.getTime());
        assertEquals("Märsta", departure.getDestination());
        assertEquals("23:02", iterator.next().getTime());
    }

    @Test
    public void shouldNotCrashIfThereAreNoDepartures() throws Exception {
        Departures result = testParse("no-trains.html");
        assertEquals("0:50", result.getUpdated());
        assertTrue(result.getStationName().contains("Stuvsta"));
        Collection<Departure> departures = result.getDepartures();
        assertEquals(0, departures.size());
    }

    @Test
    public void shouldHandleSpaceInStationName() throws Exception {
        Departures result = testParse("sodra.html");
        assertEquals("Stockholms södra", result.getStationName());
    }

    private Departures testParse(String file) throws IOException, SAXException {
        InputStream stream = getClass().getResourceAsStream("/" + file);
        return target.parse(new InputStreamReader(stream, "UTF-8"));
    }

    private Departure findNorthbound(Iterator<Departure> iterator) {
        Departure departure = iterator.next();
        while (departure.getDirection().equals("s")) {
            departure = iterator.next();
        }
        return departure;
    }

}
