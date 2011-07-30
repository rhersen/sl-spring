var state = {};

state.stationId = 9525;
state.lineHeight = 33;

function createStatus() {
    var that = {};

    var s = "n/a";

    that.get = function () {
        return s;
    };

    that.set = function (status, bg) {
        s = status;
    };

    that.getBg = function () {
        if (s === "success") {
            return '#355';
        }

        if (s === "expired") {
            return '#bce';
        }

        if (s === "error") {
            return '#c25';
        }

        return '#000';
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

state.responseStatus = createStatus();
state.updated = '';

function getCanvas() {
    return $('canvas')[0];
}

function getContext() {
    return getCanvas().getContext('2d');
}

function updateLineHeight() {
    var c = getContext();
    state.lineHeight = getCanvas().height / (state.departures.length + 2);
    c.font = state.lineHeight + "px sans-serif";
}

function updatePage(data) {
//    var nChecked = isNorthChecked();
//    var sChecked = isSouthChecked();

    function getDelayed(delayed) {
        return delayed ? "delayed" : "punctual";
    }

    state.stationName = data.stationName;
    state.updated = data.updated;
    state.departures = data.departures;

    handleResize();
}

function getMillisSinceUpdate(updated) {
    return getMillisSinceRefresh(new Date(), getMillisFromMidnight(updated));
}

function setStation(id) {
    function getAjaxUrl() {
        return "departures?id=" + state.stationId + "&direction=" + 'ns';
    }

    function handleSuccess(data, status) {
        state.millis.responseReceived();

        if (!data) {
            state.responseStatus.set("no data", $("#bg"));
            return;
        }

    if (getMillisSinceUpdate(data.updated) > 200000) {
        state.responseStatus.set("expired", $("#bg"));
    } else {
        state.responseStatus.set(status, $("#bg"));
    }

        updatePage(data);
    }

    //noinspection JSUnusedLocalSymbols
    function handleError(jqXHR, status) {
        state.millis.responseReceived();
        state.responseStatus.set(status, $("#bg"));
    }

    state.stationId = id;
    state.millis.requestSent();
    state.responseStatus.set("", $("#bg"));

    $.ajax({url: getAjaxUrl(), success: handleSuccess, error: handleError});
}

function updateCountdown(currentDate) {
    var currentTimeMillis = currentDate.getTime() - currentDate.getTimezoneOffset() * MILLIS_PER_MINUTE;

//    $("#departures tr").each(function () {
//        var countdown = getCountdown($(this).children(':first').html(), currentTimeMillis);
//        $(this).children(':last').html(countdown);
//    });
}

function updateClock() {
    var currentDate = new Date();
    draw();

    if (!state.millis) {
        state.millis = createMillis();
        setStation(state.stationId);
        return;
    }

    var millisSinceUpdate = getMillisSinceUpdate(state.updated);
    var millisSinceRequest = currentDate.getTime() - state.millis.getRequest();
    var millisSinceResponse = currentDate.getTime() - state.millis.getResponse();
    var c = getContext();
    c.fillStyle = '#fff';
    c.fillRect(0, 0, getCanvas().width, state.lineHeight);
    c.fillStyle = '#000';
    c.fillText(millisSinceUpdate + " " + millisSinceRequest + " " + millisSinceResponse + " " + state.responseStatus.get(), 4, state.lineHeight);

    if (isOutdated(millisSinceUpdate, millisSinceRequest, millisSinceResponse)) {
        setStation(state.stationId);
    }
}

function handleResize() {
    var margin = 5;
    var canvas = $('canvas')[0];
    state.innerHeight = window.innerHeight;
    canvas.style.marginLeft = margin+"px";
    canvas.style.marginTop = margin+"px";
    // set canvas dimensions

    canvas.width = window.innerWidth-(margin*2);
    canvas.height = window.innerHeight-(margin*2);

    if (state.departures) {
        updateLineHeight();
    }

    draw();
}

function getCurrentTimeMillis(currentDate) {
    return currentDate.getTime() - currentDate.getTimezoneOffset() * MILLIS_PER_MINUTE;
}
function draw() {
    var canvas = getCanvas();
    var c = getContext();

    c.fillStyle = state.responseStatus.getBg();
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = '#fff';

    var y = state.lineHeight;

    $(state.departures).each(function (i, departure) {
        c.fillText(departure.time, 8, y += state.lineHeight);
        c.fillText(departure.destination, canvas.width / 5, y);
        c.fillText(getCountdown(departure.time, getCurrentTimeMillis(new Date())), canvas.width * 4 / 5, y);

//        var row;
//        if ((nChecked && departure.direction === 'n') ||
//                (sChecked && departure.direction === 's')) {
//            row = $('<tr/>').appendTo($('#departures'));
//            row.addClass(getDelayed(departure.delayed));
//            $('<td/>').appendTo(row).html(departure.time);
//            $('<td/>').appendTo(row).html(departure.destination);
//            $('<td/>').appendTo(row).html('countdown').addClass('countdown');
//        }
    });
}

function init(id, direction) {
    state.stationId = id;
    handleResize();
    window.onresize = handleResize;

    updateClock();
    setInterval(updateClock, 256);
}
