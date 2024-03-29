<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="HandheldFriendly" content="true"/>
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="width=device-width, height=device-height, user-scalable=no"/>
    <title>canvas</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/main.css"/>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-1.6.1.min.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/timecalc.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/canvas.js"></script>

</head>

<body onload="init(${id}, '${direction}');">
<div class="fullscreen">
    <canvas>
    </canvas>
</div>
</body>

</html>
