package se.cygni.ruhe.sl;

import org.cyberneko.html.parsers.DOMParser;
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

public class Parser {
    private final Pattern stationName = Pattern.compile("(\\w+) \\(\\w+\\)");
    private final Pattern updatedAt = Pattern.compile(".*Uppdaterat kl (.?.:..).*", Pattern.DOTALL);
    private final Pattern departureTime = Pattern.compile(".*(..:..).*", Pattern.DOTALL);

    public Departures parse(InputStreamReader html) throws IOException, SAXException {
        DOMParser neko = new DOMParser();
        neko.parse(new InputSource(html));
        Node startDiv = getStartDiv(neko);
        Node bold = startDiv.getFirstChild();
        Node updated = startDiv.getNextSibling().getFirstChild();
        Node realtimeResult = updated.getNextSibling().getNextSibling().getNextSibling();
        Node n1 = findTrain(realtimeResult).getNextSibling().getNextSibling();
        Node n2 = n1.getNextSibling().getNextSibling();
        Collection<Departure> d1 = getDepartures(n1);
        Collection<Departure> d2 = getDepartures(n2);
        Collection<Departure> northbound;
        Collection<Departure> southbound;

        if (isNorthbound(d1)) {
            northbound = d1;
            southbound = d2;
        } else {
            northbound = d2;
            southbound = d1;
        }

        return new Departures(getMatch(updated, updatedAt), getMatch(bold, stationName), northbound, southbound);
    }

    private boolean isNorthbound(Collection<Departure> departures) {
        for (Departure departure : departures) {
            if (departure.getDestination().equals("Bålsta") || departure.getDestination().equals("Märsta")) {
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
            r.add(new Departure(time, destination, delayed));
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
