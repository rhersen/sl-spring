var x = 11;
var y = 11;

var state = {
    stationId: 9525,
    updated: '',
    millis: createMillis(),
    currentDate: new Date(),
    responseStatus: function () {
        var that = {};

        var s = "n/a";

        that.get = function () {
            return s;
        };

        that.set = function (status) {
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
    }()
};

function getCanvas() {
    return $('canvas')[0];
}

function getContext() {
    return getCanvas().getContext('2d');
}

function getMillisSinceUpdate() {
    return getMillisSinceRefresh(state.currentDate, getMillisFromMidnight(state.updated));
}

function getCurrentTimeMillis(currentDate) {
    return currentDate.getTime() - currentDate.getTimezoneOffset() * MILLIS_PER_MINUTE;
}

function getLineHeight(canvas) {
    function reduce(a, identity, f) {
        if (a.length === 0) {
            return identity;
        } else {
            return f(a[0], reduce(a.slice(1), identity, f));
        }
    }

    var lineHeight = getLineHeightToFitHeight(canvas);
    var c = canvas.getContext('2d');

    c.font = "100px sans-serif";

    var a = $($.makeArray($(state.departures)).map(function (departure) {
        var textLeft = departure.time + ' ' + departure.fullDestination;
        var countdown = getCountdown(departure.time, getCurrentTimeMillis(state.currentDate));
        var width = c.measureText(textLeft).width + c.measureText(countdown).width;
        return 99 * canvas.width / width;
    }));

    return reduce(a, lineHeight,
        function (x, y) {
        if (x < y) {
            return x;
        } else {
            return y;
        }
    });
}

function draw(canvas) {
    function getStatusString() {
        return getMillisSinceUpdate() + " " + state.millis.getRequest() + " " + state.millis.getResponse() + " " + state.responseStatus.get();
    }

    var c = canvas.getContext('2d');
    var lineHeight = getLineHeight(canvas, c);
    c.font = lineHeight + "px sans-serif";

    c.fillStyle = state.responseStatus.getBg();
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.fillStyle = '#fff';
    c.fillText(state.stationName, 4, lineHeight);
    c.fillText(getStatusString(), 4, lineHeight * 2);

    $(state.departures).each(function (i, departure) {
        function getY(i) {
            return lineHeight * (i + 3);
        }

        function fillTextRight(countdown) {
            var rightEdge = canvas.width;
            var measured = c.measureText(countdown);
            c.fillText(countdown, rightEdge - measured.width, getY(i));
        }

        var textLeft = departure.time + ' ' + departure.fullDestination;
        var countdown = getCountdown(departure.time, getCurrentTimeMillis(state.currentDate));
        c.fillText(textLeft, 8, getY(i));
        fillTextRight(countdown);
    });
}

function getLineHeightToFitHeight(canvas) {
    if (state.departures) {
        return canvas.height / (state.departures.length + 2);
    } else {
        return 100;
    }
}

function init(id, direction) {
    function handleResize() {
        var margin = 5;
        state.innerHeight = window.innerHeight;
        getCanvas().style.marginLeft = margin + "px";
        getCanvas().style.marginTop = margin + "px";

        getCanvas().width = window.innerWidth - (margin * 2);
        getCanvas().height = window.innerHeight - (margin * 2);
    }

    function run() {
        function shouldUpdate() {
            return isOutdated(getMillisSinceUpdate(), state.millis.getRequest(), state.millis.getResponse());
        }

        function setStation(id) {
            function getAjaxUrl() {
                return "departures?id=" + state.stationId + "&direction=" + 'ns';
            }

            function handleSuccess(data, status) {
                state.millis.responseReceived();

                if (!data) {
                    state.responseStatus.set("no data");
                    return;
                }

                state.stationName = data.stationName;
                state.updated = data.updated;
                state.departures = data.departures;

                if (getMillisSinceUpdate() > 200000) {
                    state.responseStatus.set("expired");
                } else {
                    state.responseStatus.set(status);
                }

                handleResize();
            }

            //noinspection JSUnusedLocalSymbols
            function handleError(jqXHR, status) {
                state.millis.responseReceived();
                state.responseStatus.set(status);
            }

            state.stationId = id;
            state.millis.requestSent();
            state.responseStatus.set("");

            $.ajax({url: getAjaxUrl(), success: handleSuccess, error: handleError});
        }

        state.currentDate = new Date();
        
        draw(getCanvas());

        if (shouldUpdate()) {
            setStation(state.stationId);
        }
    }

    state.stationId = id;
    setInterval(run, 256);
    window.onresize = handleResize;
    handleResize();
}
