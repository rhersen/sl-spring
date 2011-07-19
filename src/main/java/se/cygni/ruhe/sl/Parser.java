package se.cygni.ruhe.sl;

import org.cyberneko.html.parsers.DOMParser;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayDeque;
import java.util.Collection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class Parser {
    private final Pattern stationName = Pattern.compile(".*Pendeltåg, (\\S+ ?\\S*).*", Pattern.DOTALL);
    private final Pattern updatedAt = Pattern.compile(".*Uppdaterat kl (.?.:..).*", Pattern.DOTALL);
    private final Pattern departureTime = Pattern.compile(".*(..:..).*", Pattern.DOTALL);

    public Departures parse(InputStreamReader html) throws IOException, SAXException {
        DOMParser neko = new DOMParser();
        neko.parse(new InputSource(html));
        Node startDiv = getStartDiv(neko);
        Node updated = startDiv.getNextSibling().getFirstChild();
        String when = getMatch(updated, updatedAt);
        Node realtimeResult = updated.getNextSibling().getNextSibling().getNextSibling();
        Node train = findTrain(realtimeResult);

        if (train == null) {
            return new Departures(when, startDiv.getFirstChild().getTextContent());
        }

        String where = getMatch(train, stationName);

        return new Departures(when, where, getTrainDepartures(train));
    }

    private Node getStartDiv(DOMParser neko) {
        Document document = neko.getDocument();
        return document.getFirstChild().getNextSibling().getFirstChild().getNextSibling().getFirstChild()
                .getFirstChild().getNextSibling().getNextSibling().getNextSibling()
                .getFirstChild().getFirstChild().getFirstChild().getNextSibling().getNextSibling().getFirstChild()
                .getNextSibling().getNextSibling().getNextSibling().getFirstChild();
    }

    private Node findTrain(Node realtimeResult) {
        NodeList childNodes = realtimeResult.getChildNodes();
        for (int i = 0; i < childNodes.getLength(); i++) {
            Node p = childNodes.item(i);
            if (p.getNodeName().equals("P")) {
                Node b = p.getFirstChild();
                if (b.getNodeName().equals("B")) {
                    String textContent = b.getTextContent();
                    if (textContent.contains("Pendel")) {
                        return b;
                    }
                }
            }
        }
        return null;
    }

    private Collection<Departure> getTrainDepartures(Node train) {
        Collection<Departure> r = new ArrayDeque<Departure>();
        Collection<String[]> d1 = getOneHalfOfTheDepartures(train);
        Collection<String[]> d2 = getOtherHalfOfTheDepartures(train);
        boolean isNorthFirst = isNorthbound(d1);

        for (String[] departure : d1) {
            r.add(createDeparture(departure, isNorthFirst ? "n" : "s"));
        }

        for (String[] departure : d2) {
            r.add(createDeparture(departure, isNorthFirst ? "s" : "n"));
        }

        return r;
    }

    private Collection<String[]> getOneHalfOfTheDepartures(Node train) {
        return getDepartures(train.getNextSibling().getNextSibling());
    }

    private Collection<String[]> getOtherHalfOfTheDepartures(Node train) {
        return getDepartures(train.getNextSibling().getNextSibling().getNextSibling().getNextSibling());
    }

    private boolean isNorthbound(Collection<String[]> departures) {
        for (String[] departure : departures) {
            if (departure[1].endsWith("lsta") || departure[1].endsWith("rsta")) {
                return true;
            }
        }

        return false;
    }

    private Departure createDeparture(String[] d, String direction) {
        return new Departure(d[0], d[1], d[2].length() > 1, direction);
    }

    private Collection<String[]> getDepartures(Node node) {
        Node firstChild = node.getFirstChild();
        NodeList childNodes = firstChild.getChildNodes();
        Collection<String[]> r = new ArrayDeque<String[]>();
        for (int i = 0; i < childNodes.getLength(); i++) {
            Node item = childNodes.item(i);
            String time = getMatch(item.getFirstChild(), departureTime);
            String destination = item.getFirstChild().getNextSibling().getTextContent().trim();
            Node nextSibling = item.getFirstChild().getNextSibling().getNextSibling();
            String delayedTime = nextSibling.getTextContent().trim();
            if (delayedTime.length() > 1) {
                time = getMatch(nextSibling, departureTime);
            }
            r.add(new String[]{time, destination, delayedTime});
        }
        return r;
    }

    private String getMatch(Node updated, Pattern pattern) {
        String textContent = updated.getTextContent();
        Matcher matcher = pattern.matcher(textContent);

        if (!matcher.matches()) {
            return textContent;
        }

        return matcher.group(1);
    }

}
