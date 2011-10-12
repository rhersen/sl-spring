var touchHandler = {
    n: 11,
    x: 11,
    y: 11,
    handleTouch: function (event) {
        this.n = event.touches.length;
        this.x = event.touches[0].clientX;
        this.y = event.touches[0].clientY;
//        setStation(state.stationId + 1);
        event.preventDefault();
    }
};

var state = {
    stationId: 9525,
    updated: '',
    millis: createMillis(),
    currentDate: new Date(),
    responseStatus: function () {

        var s = "n/a";

        function get() {
            return s;
        }

        function set(status) {
            s = status;
        }

        function getBg() {
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
        }

        return {
            getBg: getBg,
            set: set
        };
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

function getLineHeight(canvas) {
    var c = canvas.getContext('2d');

    c.font = "100px sans-serif";

    return reduce($(getDepartureArray().map(getLineHeightToFitWidth)), getLineHeightToFitHeight(canvas), max);

    function reduce(a, identity, f) {
        if (a.length === 0) {
            return identity;
        } else {
            return f(a[0], reduce(a.slice(1), identity, f));
        }
    }

    function getDepartureArray() {
        return $.makeArray($(state.departures));
    }

    function getLineHeightToFitWidth(departure) {
        var countdown = getCountdown(departure.time, getCurrentTimeMillis(state.currentDate));
        var width = c.measureText(getLeftText(departure)).width + c.measureText(countdown).width;
        return 99 * canvas.width / width;

        function getLeftText(departure) {
            return departure.time + ' ' + departure.fullDestination;
        }
    }

    function getLineHeightToFitHeight(canvas) {
        if (state.departures) {
            return canvas.height / (state.departures.length + 2);
        } else {
            return 100;
        }
    }

    function max(x, y) {
        if (x < y) {
            return x;
        } else {
            return y;
        }
    }
}

function draw(canvas) {
    var c = canvas.getContext('2d');
    var lineHeight = getLineHeight(canvas);

    clear();
    setStyle();
    drawHeader();
    $(state.departures).each(drawLine);

    function clear() {
        c.fillStyle = state.responseStatus.getBg();
        c.fillRect(0, 0, canvas.width, canvas.height);
    }

    function setStyle() {
        c.font = lineHeight + "px sans-serif";
        c.fillStyle = '#fff';
    }

    function drawHeader() {
        c.fillText(state.stationName, 4, lineHeight);
        c.fillText(getStatusString(), 4, lineHeight * 2);
    }

    function drawLine(i, departure) {
        var y = lineHeight * (i + 3);
        drawTextLeft(departure.time + ' ' + departure.fullDestination);
        drawTextRight(getCountdown(departure.time, getCurrentTimeMillis(state.currentDate)));

        function drawTextLeft(text) {
            c.fillText(text, 8, y);
        }

        function drawTextRight(text) {
            var rightEdge = canvas.width;
            var measured = c.measureText(text);
            c.fillText(text, rightEdge - measured.width, y);
        }
    }

    function getStatusString() {
//        return getMillisSinceUpdate() + " " + state.millis.getRequest() + " " + state.millis.getResponse() + " " + state.responseStatus.get();
        return touchHandler.n + "|" + touchHandler.x + "|" + touchHandler.y;
    }
}

function init(id, direction) {
    var canvas = getCanvas();
    state.stationId = id;
    setInterval(run, 256);
    window.onresize = handleResize;
    canvas.ontouchstart = function (event) { return touchHandler.handleTouch(event)};
    handleResize();

    function run() {
        state.currentDate = new Date();

        draw(canvas);

        if (shouldUpdate()) {
            setStation(state.stationId);
        }

        function shouldUpdate() {
            return isOutdated(getMillisSinceUpdate(), state.millis.getRequest(), state.millis.getResponse());
        }

        function setStation(id) {
            state.stationId = id;
            state.millis.requestSent();
            state.responseStatus.set("");

            $.ajax({url: getAjaxUrl(), cache: false, success: handleSuccess, error: handleError});

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
        }
    }

    function handleResize() {
        var margin = 5;
        state.innerHeight = window.innerHeight;
        canvas.style.marginLeft = margin + "px";
        canvas.style.marginTop = margin + "px";

        canvas.width = window.innerWidth - (margin * 2);
        canvas.height = window.innerHeight - (margin * 2);
    }
}
