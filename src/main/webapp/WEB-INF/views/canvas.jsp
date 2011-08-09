<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="HandheldFriendly" content="true"/>
    <meta name="viewport" content="width=device-width, height=device-height, user-scalable=no"/>
    <title>canvas</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/main.css"/>
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/jquery-1.6.1.min.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/timecalc.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/canvas.js"></script>

</head>

<body onload="init(${id}, '${direction}');">
<div class="fullscreen">
    <canvas>
    </canvas>
</div>
</body>

</html>
