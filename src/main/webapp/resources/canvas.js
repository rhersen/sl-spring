var state = {
    stationId: 9525,
    updated: '',
    millis: createMillis(),
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
    return getMillisSinceRefresh(new Date(), getMillisFromMidnight(state.updated));
}

function draw(canvas) {
    function getCurrentTimeMillis(currentDate) {
        return currentDate.getTime() - currentDate.getTimezoneOffset() * MILLIS_PER_MINUTE;
    }

    var c = canvas.getContext('2d');
    var lineHeight = getLineHeight(canvas);

    c.font = lineHeight + "px sans-serif";

    c.fillStyle = state.responseStatus.getBg();
    c.fillRect(0, 0, canvas.width, getCanvas().height);

    c.fillStyle = '#fff';
    c.fillText(getMillisSinceUpdate() + " " + state.millis.getRequest() + " " + state.millis.getResponse() + " " + state.responseStatus.get(), 4, lineHeight);

    $(state.departures).each(function (i, departure) {
        function getY(i) {
            return lineHeight * (i + 2);
        }

        c.fillText(departure.time, 8, getY(i));
        c.fillText(departure.destination, getCanvas().width / 5, lineHeight * (i + 2));
        c.fillText(getCountdown(departure.time, getCurrentTimeMillis(new Date())), getCanvas().width * 4 / 5, lineHeight * (i + 2));
    });
}

function getLineHeight(canvas) {
    if (state.departures) {
        return canvas.height / (state.departures.length + 2);
    } else {
        return 33;
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
