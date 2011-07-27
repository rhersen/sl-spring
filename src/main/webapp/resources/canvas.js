var state = {};

state.stationId = 9525;

function createStatus() {
    var that = {};

    var s = "n/a";

    that.get = function () {
        return s;
    };

    that.set = function (status, bg) {
        s = status;

        bg.removeClass("pending");
        bg.removeClass("error");
        bg.removeClass("expired");

        if (status === "") {
            bg.addClass("pending");
        } else if (status === "expired") {
            bg.addClass("expired");
        } else if (status === "success") {
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

state.responseStatus = createStatus();
state.updated = '';

function getCanvas() {
    return $('canvas')[0];
}

function getContext() {
    return getCanvas().getContext('2d');
}
function updatePage(data) {
//    var nChecked = isNorthChecked();
//    var sChecked = isSouthChecked();

    function getDelayed(delayed) {
        return delayed ? "delayed" : "punctual";
    }
    //$("#station").html(data.stationName);

    state.updated = data.updated;
    //$("#updated").html(updated);

    //$('#departures tr').remove();

    var c = getContext();
    state.lineHeight = getCanvas().height / (data.departures.length + 2);
    c.font = state.lineHeight + "px sans-serif";
    var y = state.lineHeight;

    $(data.departures).each(function (i, departure) {
        c.fillText(departure.time, 8, y += state.lineHeight);
        c.fillText(departure.destination, state.lineHeight * 4, y);
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
//            state.responseStatus.set("no data", $("#bg"));
            return;
        }

    if (getMillisSinceUpdate(data.updated) > 200000) {
//        state.responseStatus.set("expired", $("#bg"));
    } else {
//        state.responseStatus.set(status, $("#bg"));
    }

        updatePage(data);
    }

    //noinspection JSUnusedLocalSymbols
    function handleError(jqXHR, status) {
        state.millis.responseReceived();
//        state.responseStatus.set(status, $("#bg"));
    }

    state.stationId = id;
    state.millis.requestSent();
//    state.responseStatus.set("", $("#bg"));

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
    updateCountdown(currentDate);

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
    var canvas = $('canvas')[0];
    var div = $('div.fullscreen')[0];
    canvas.width = div.scrollWidth - 4;
    canvas.height = div.scrollHeight - 4;
    var c = getContext();
    c.font = canvas.height / 10 + "px serif";
    draw();
}

function draw() {
    var canvas = getCanvas();
    var c = getContext();

    c.strokeStyle = '#f00'; // red
    c.lineWidth = 4;

    c.fillStyle = '#fff';
    c.fillRect(0, 0, canvas.width - 8, canvas.height - 8);
    c.strokeRect(0, 0, canvas.width - 8, canvas.height - 8);
    c.fillStyle = '#000';
}

function init(id, direction) {
    state.stationId = id;
    handleResize();
    window.onresize = handleResize;

    updateClock();
    setInterval(updateClock, 256);
}
