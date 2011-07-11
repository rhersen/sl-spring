var stationId = 9525;

function createStatus() {
    var that = {};

    var s = "n/a";

    that.get = function () {
        return s;
    };

    that.set = function (status, bg) {
        s = status;

        if (status === "") {
            bg.addClass("pending");
        } else {
            bg.removeClass("pending");
        }

        if (status === "" || status === "success") {
            bg.removeClass("error");
        } else {
            bg.addClass("error");
        }
    };

    return that;
}

function createMillis() {
    var that = {};

    var requestMillis = new Date().getTime();
    var responseMillis = requestMillis;

    that.getRequest = function () {
        return requestMillis;
    };

    that.getResponse = function () {
        return responseMillis;
    };

    that.requestSent = function () {
        requestMillis = new Date().getTime();
    };

    that.responseReceived = function () {
        responseMillis = new Date().getTime();
    };

    return that;
}

function isNorthbound() {
    return $("#northbound").prop("checked");
}

function isSouthbound() {
    return $("#southbound").prop("checked");
}

function getDirection() {
    var r = (isNorthbound() ? "n" : "") + (isSouthbound() ? "s" : "");

    if (r) {
        return r;
    }

    return "ns";
}

function setDirection(direction) {
    $("#northbound").prop("checked", /n/.test(direction));
    $("#southbound").prop("checked", /s/.test(direction));
}

var millis;
var responseStatus = createStatus();

function updatePage(data) {
    function getDelayed(delayed) {
        return delayed ? "delayed" : "punctual";
    }

    $("#station").html(data.stationName);
    $("#updated").html(data.updated);

    $('#departures tr').remove();

    $(data.departures).each(function (i, departure) {
        var row = $('<tr/>').appendTo($('#departures'));
        row.addClass(getDelayed(departure.delayed));
        $('<td/>').appendTo(row).html(departure.time);
        $('<td/>').appendTo(row).html(departure.destination);
        $('<td/>').appendTo(row).html('countdown').addClass('countdown');
    });
}

function setStation(id) {
    function getAjaxUrl() {
        return "/station/departures?id=" + stationId + "&direction=" + getDirection();
    }

    function handleSuccess(data, status) {
        millis.responseReceived();

        if (!data) {
            responseStatus.set("no data", $("#bg"));
            return;
        }

        responseStatus.set(status, $("#bg"));
        updatePage(data);
    }

    //noinspection JSUnusedLocalSymbols
    function handleError(jqXHR, status) {
        millis.responseReceived();
        responseStatus.set(status, $("#bg"));
    }

    stationId = id;
    millis.requestSent();
    responseStatus.set("", $("#bg"));

    $.ajax({url: getAjaxUrl(), success: handleSuccess, error: handleError});
}

function updateCountdown(currentDate) {
    var currentTimeMillis = currentDate.getTime() - currentDate.getTimezoneOffset() * MILLIS_PER_MINUTE;

    $("#departures tr").each(function () {
        var countdown = getCountdown($(this).children(':first').html(), currentTimeMillis);
        $(this).children(':last').html(countdown);
    });
}

function updateClock() {
    var currentDate = new Date();
    updateCountdown(currentDate);
    var updated = $('#updated').text();

    if (!millis) {
        millis = createMillis();
        setStation(stationId);
        return;
    }

    var millisSinceUpdate = getMillisSinceRefresh(currentDate, getMillisFromMidnight(updated));
    var millisSinceRequest = currentDate.getTime() - millis.getRequest();
    var millisSinceResponse = currentDate.getTime() - millis.getResponse();
    $('#ago').text(millisSinceUpdate + " " + millisSinceRequest + " " + millisSinceResponse + " " + responseStatus.get());

    if (isOutdated(millisSinceUpdate, millisSinceRequest, millisSinceResponse)) {
        setStation(stationId);
    }
}

//noinspection JSUnusedGlobalSymbols
function init(id, direction) {
    stationId = id;
    setDirection(direction);
    updateClock();
    setInterval(updateClock, 256);
}
