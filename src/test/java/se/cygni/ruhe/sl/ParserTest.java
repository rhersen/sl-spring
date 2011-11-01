package se.cygni.ruhe.sl;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import java.io.IOException;
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
        Departure departure = findSouthbound(iterator);
        assertEquals("22:30", departure.getTime());
        assertEquals("Södertälje hamn", departure.getFullDestination());
        assertTrue("should be delayed", departure.isDelayed());
        assertFalse("should not be delayed", iterator.next().isDelayed());
    }

    @Test
    public void shouldHandleNewFormat() throws Exception {
        Departures result = testParse("newFormat.html");
        assertEquals("18:06", result.getUpdated());
        assertEquals("Tullinge", result.getStationName());
        Collection<Departure> departures = result.getDepartures();
        assertEquals(10, departures.size());
        Iterator<Departure> iterator = departures.iterator();
        Departure departure = findSouthbound(iterator);
        assertEquals("18:07", departure.getTime());
        assertEquals("Tumba", departure.getFullDestination());
        assertTrue("should be delayed", departure.isDelayed());
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
        String xml = FileUtils.readFileToString(FileUtils.toFile(this.getClass().getResource("/" + file)), "UTF-8");
        return target.parse(xml);
    }

    private Departure findSouthbound(Iterator<Departure> iterator) {
        return skipDirection(iterator, "n");
    }

    private Departure findNorthbound(Iterator<Departure> iterator) {
        return skipDirection(iterator, "s");
    }

    private Departure skipDirection(Iterator<Departure> iterator, String skip) {
        Departure departure = iterator.next();
        while (departure.getDirection().equals(skip)) {
            departure = iterator.next();
        }
        return departure;
    }

}
