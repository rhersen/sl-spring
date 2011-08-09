package se.cygni.ruhe.sl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

@Controller
@RequestMapping(value = "/station")
public class StationController {

    @Autowired
    Parser parser;

    @RequestMapping(value = "/static", method = RequestMethod.GET)
    public String getStatic(@RequestParam String id, Model model) throws IOException, SAXException {
        URL url = new URL("http://mobilrt.sl.se/?tt=TRAIN&SiteId=" + id);
        Departures departures = parser.parse(new InputStreamReader(url.openStream(), "UTF-8"));

        model.addAttribute("departures", departures);
        return "static";
    }

    @RequestMapping(value = "/dynamic", method = RequestMethod.GET)
    public String getDynamic(@RequestParam String id, @RequestParam String direction, Model model)
            throws IOException, SAXException {
        model.addAttribute("id", id);
        model.addAttribute("direction", direction);
        return "dynamic";
    }

    @RequestMapping(value = "/canvas", method = RequestMethod.GET)
    public String getCanvas(@RequestParam String id, @RequestParam String direction, Model model)
            throws IOException, SAXException {
        model.addAttribute("id", id);
        model.addAttribute("direction", direction);
        return "canvas";
    }

    @RequestMapping(value = "/departures", method = RequestMethod.GET)
    public
    @ResponseBody
    Departures getJson(@RequestParam String id) throws IOException, SAXException {
        try {
            URL url = new URL("http://mobilrt.sl.se/?tt=TRAIN&SiteId=" + id);
            return parser.parse(new InputStreamReader(url.openStream(), "UTF-8"));
        } catch (IOException e) {
            return createFakeDepartures();
        }
    }

    private Departures createFakeDepartures() {
        Collection<Departure> ds = new ArrayList<Departure>();
        String updated = new SimpleDateFormat("hh:mm").format(new Date());
        ds.add(new Departure(updated, "Arvidsjaur", false, "n"));
        ds.add(new Departure(updated, "Burseryd", false, "s"));
        return new Departures(updated, "IOException", ds);
    }

    @SuppressWarnings({"UnusedParameters"})
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public String getNothing(Model model) throws IOException, SAXException {
        return "test";
    }

}
