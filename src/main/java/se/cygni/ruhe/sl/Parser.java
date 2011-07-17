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

        Node n1 = train.getNextSibling().getNextSibling();
        Node n2 = n1.getNextSibling().getNextSibling();
        Collection<Departure> d1 = getDepartures(n1);
        Collection<Departure> d2 = getDepartures(n2);
        boolean isNorthFirst = isNorthbound(d1);
        Collection<Departure> northbound = isNorthFirst ? d1 : d2;
        Collection<Departure> southbound = isNorthFirst ? d2 : d1;

        for (Departure departure : northbound) {
            departure.setDirection("n");
        }

        for (Departure departure : southbound) {
            departure.setDirection("s");
        }

        return new Departures(when, where, northbound, southbound);
    }

    private boolean isNorthbound(Collection<Departure> departures) {
        for (Departure departure : departures) {
            if (departure.getDestination().endsWith("lsta") || departure.getDestination().endsWith("rsta")) {
                return true;
            }
        }

        return false;
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

    private Node getStartDiv(DOMParser neko) {
        Document document = neko.getDocument();
        return document.getFirstChild().getNextSibling().getFirstChild().getNextSibling().getFirstChild()
                .getFirstChild().getNextSibling().getNextSibling().getNextSibling()
                .getFirstChild().getFirstChild().getFirstChild().getNextSibling().getNextSibling().getFirstChild()
                .getNextSibling().getNextSibling().getNextSibling().getFirstChild();
    }

    private Collection<Departure> getDepartures(Node node) {
        Node firstChild = node.getFirstChild();
        NodeList childNodes = firstChild.getChildNodes();
        Collection<Departure> r = new ArrayDeque<Departure>();
        for (int i = 0; i < childNodes.getLength(); i++) {
            Node item = childNodes.item(i);
            String time = getMatch(item.getFirstChild(), departureTime);
            String destination = item.getFirstChild().getNextSibling().getTextContent().trim();
            Node nextSibling = item.getFirstChild().getNextSibling().getNextSibling();
            String s = nextSibling.getTextContent().trim();
            boolean delayed = s.length() > 1;
            if (delayed) {
                time = getMatch(nextSibling, departureTime);
            }
            r.add(new Departure(time, destination, delayed, null));
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
