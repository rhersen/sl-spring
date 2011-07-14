package se.cygni.ruhe.sl;

import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.Collection;

import static org.junit.Assert.assertEquals;

public class StationControllerTest {
    private StationController target;
    private Collection<Departure> n;
    private Collection<Departure> s;
    private Departures departures;

    @Before
    public void setUp() throws Exception {
        target = new StationController();
        n = Arrays.asList(new Departure("11:12", "Marsta", false));
        s = Arrays.asList(new Departure("11:13", "Sutelje", false));
        departures = new Departures("11:11", "Tumba", n, s);
    }

    @Test
    public void filterNorth() throws Exception {
        Departures result = target.filter(departures, "n");
        assertEquals(n, result.getDepartures());
    }

    @Test
    public void filterSouth() throws Exception {
        Departures result = target.filter(departures, "s");
        assertEquals(s, result.getDepartures());
    }

    @Test
    public void shouldGetBothIfDirectionIsEmpty() throws Exception {
        Departures result = target.filter(departures, "");
        assertEquals(departures.getDepartures(), result.getDepartures());
    }
}
