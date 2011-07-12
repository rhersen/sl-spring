<%@page contentType="text/html;charset=UTF-8" %>
<%@page pageEncoding="UTF-8" %>
<%@ page session="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-type" content="text/html;charset=ISO-8859-1"/>
    <meta name="HandheldFriendly" content="true"/>
    <title>sl</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/main.css"/>
    <meta name="layout" content="main"/>
</head>
<body>

<div id="pageBody">
    <div class="dialog">
        <ol>
            <li class="controller"><a href="${pageContext.request.contextPath}/station/dynamic?id=9525&direction=n">Tullinge</a></li>
            <li class="controller"><a href="${pageContext.request.contextPath}/station/dynamic?id=9001&direction=s">Centralen</a></li>
            <li class="controller"><a href="${pageContext.request.contextPath}/station/dynamic?id=9510&direction=s">Karlberg</a></li>
            <li class="controller"><a href="${pageContext.request.contextPath}/station/dynamic?id=9529&direction=ns">Älvsjö</a></li>
            <li class="controller"><a href="${pageContext.request.contextPath}/station/dynamic?id=9702&direction=s">Jakobsberg</a></li>
        </ol>
    </div>
</div>
</body>
</html>
