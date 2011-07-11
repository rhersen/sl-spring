<%@ page import="se.cygni.ruhe.sl.Departure" %>
<%@ page import="se.cygni.ruhe.sl.Departures" %>
<%@ page session="false" %>
<html>
<head>
    <title><%=request.getAttribute("title")%>
    </title>
</head>
<body>
<%
    Departures departures = (Departures) request.getAttribute("departures");
%>

<h1><%= departures.getStationName() %>
</h1>

<h2><%= departures.getUpdated() %>
</h2>
<ol>
    <%
        for (Departure departure : departures.getNorthbound()) {
    %>
    <li>
        <%= departure %>
    </li>
    <%
        }
    %>
</ol>
<ul>
    <%
        for (Departure departure : departures.getSouthbound()) {
    %>
    <li>
        <%= departure %>
    </li>
    <%
        }
    %>
</ul>
</body>
</html>
