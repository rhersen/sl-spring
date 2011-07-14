<%@page contentType="text/html;charset=UTF-8" %>
<%@page pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
          "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <script src="${pageContext.request.contextPath}/resources/jquery-1.6.1.min.js" type="text/javascript"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/qunit.css" type="text/css" media="screen" />
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/qunit.js"></script>

    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/station.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/timecalc.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/station-test.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/timecalc-test.js"></script>
  </head>
  <body>
    <h1 id="qunit-header">Test of station.js</h1>
    <h2 id="qunit-banner"></h2>
    <ol>
        <li><a href="${pageContext.request.contextPath}/station/dynamic?id=9525&direction=n">Tullinge</a></li>
        <li><a href="${pageContext.request.contextPath}/station/dynamic?id=9001&direction=s">Centralen</a></li>
        <li><a href="${pageContext.request.contextPath}/station/dynamic?id=9510&direction=s">Karlberg</a></li>
        <li><a href="${pageContext.request.contextPath}/station/dynamic?id=9529&direction=ns">Älvsjö</a></li>
        <li><a href="${pageContext.request.contextPath}/station/dynamic?id=9702&direction=s">Jakobsberg</a></li>
    </ol>
    <h2 id="qunit-userAgent"></h2>
    <ol id="qunit-tests"></ol>
    <div id="qunit-fixture">
      test markup, will be hidden
        <label for="northbound">N</label><input type="checkbox" id="northbound" value="val" />
        <label for="southbound">S</label><input type="checkbox" id="southbound" value="val" />
        <table id="departures">
            <tr>
                <td>8:07</td>
                <td>station1</td>
                <td class="countdown">countdown1</td>
            </tr>
            <tr>
                <td>8:11</td>
                <td>station2</td>
                <td class="countdown">countdown2</td>
            </tr>
        </table>
      <div id="bg">
      </div>
    </div>
  </body>
</html>
