 <%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
 <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
          "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
      <meta http-equiv="Content-type" content="text/html;charset=UTF-8"/>
      <meta name="HandheldFriendly" content="true"/>
      <meta name="viewport"
            content="width=device-width, height=device-height, user-scalable=no"/>
      <title>station</title>
      <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/main.css"/>

      <script type="text/javascript" src="${pageContext.request.contextPath}/resources/jquery-1.6.1.min.js" ></script>
      <script type="text/javascript" src="${pageContext.request.contextPath}/resources/timecalc.js" ></script>
      <script type="text/javascript" src="${pageContext.request.contextPath}/resources/station.js" ></script>
  </head>

  <body id="bg" onload="init(${id}, '${direction}');">
  <div>
      <span id="updated" onclick="next();">updated</span>
      &nbsp;
      <span id="station" onclick="previous();">
          station
      </span>
  </div>

  <div>
      <span onclick="setStation(9510);">K</span>
      <span onclick="setStation(9001);">C</span>
      <span onclick="setStation(9530);">S</span>
      <span onclick="setStation(9531);">Å</span>
      <span onclick="setStation(9529);">Ä</span>
      <span onclick="setStation(9528);">V</span>
      <span onclick="setStation(9527);">H</span>
      <span onclick="setStation(9526);">F</span>
      <span onclick="setStation(9525);">T</span>
      <span onclick="setStation(9524);">M</span>
      <span onclick="setStation(9523);">R</span>
  </div>
  
  <h3 id="ago">ago</h3>

  <div>
      <label for="northbound">N</label><input type="checkbox" id="northbound" value="val"/>
      <label for="southbound">S</label><input type="checkbox" id="southbound" value="val"/>
  </div>

    <table id="departures">
      <tr>
	    <td>time</td>
	    <td>station</td>
	    <td class="countdown">countdown</td>
      </tr>
    </table>
  </body>
</html>
