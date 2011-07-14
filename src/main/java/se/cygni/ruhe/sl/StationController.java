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
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Collections;

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

    @RequestMapping(value = "/departures", method = RequestMethod.GET)
    public
    @ResponseBody
    Departures getJson(@RequestParam String id, @RequestParam String direction) throws IOException, SAXException {
        URL url = new URL("http://mobilrt.sl.se/?tt=TRAIN&SiteId=" + id);
        Departures parsed = parser.parse(new InputStreamReader(url.openStream(), "UTF-8"));
        return filter(parsed, direction);
    }

    public Departures filter(Departures parsed, String direction) {
        boolean n = direction.contains("n") || direction.isEmpty();
        boolean s = direction.contains("s") || direction.isEmpty();

        return new Departures(parsed.getUpdated(), parsed.getStationName(),
                n ? parsed.getNorthbound(): Collections.<Departure>emptyList(),
                s ? parsed.getSouthbound(): Collections.<Departure>emptyList());
    }

    @SuppressWarnings({"UnusedParameters"})
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public String getNothing(Model model) throws IOException, SAXException {
        return "test";
    }

}
