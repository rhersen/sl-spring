package se.cygni.ruhe.sl;

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

@Controller
@RequestMapping(value = "/station")
public class StationController {

    @RequestMapping(value = "/static", method = RequestMethod.GET)
    public String getStatic(@RequestParam("id") String id, Model model) throws IOException, SAXException {
        URL url = new URL("http://mobilrt.sl.se/?tt=TRAIN&SiteId=" + id);
        Departures departures = new Parser().parse(new InputStreamReader(url.openStream(), "UTF-8"));

        model.addAttribute("departures", departures);
        return "static";
    }

    @RequestMapping(value = "/dynamic", method = RequestMethod.GET)
    public String getDynamic(@RequestParam("id") String id, Model model) throws IOException, SAXException {
        model.addAttribute("id", id);
        return "dynamic";
    }

    @RequestMapping(value="/departures", method=RequestMethod.GET)
    public @ResponseBody
    Departures getJson(@RequestParam String id) throws IOException, SAXException {
        URL url = new URL("http://mobilrt.sl.se/?tt=TRAIN&SiteId=" + id);
        return new Parser().parse(new InputStreamReader(url.openStream(), "UTF-8"));
    }

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public String getNothing(Model model) throws IOException, SAXException {
        return "test";
    }

}
