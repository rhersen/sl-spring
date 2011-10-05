var MILLIS_PER_MINUTE = 60 * 1000;
var MILLIS_PER_HOUR = 60 * MILLIS_PER_MINUTE;
var MILLIS_PER_DAY = 24 * MILLIS_PER_HOUR;

function getMillisFromMidnight(hhmm) {
    var colon = hhmm.indexOf(":");
    return hhmm.slice(0, colon) * MILLIS_PER_HOUR + hhmm.slice(colon + 1) * MILLIS_PER_MINUTE;

}

function getCountdown(hhmm, currentTimeMillis)   {
    if (hhmm.indexOf(":") === -1) {
        return "?";
    }

    return getDiff();

    function getDiff() {
        var diffMillis = getDiffMillis();
        var isNegative = diffMillis < 0;
        var diffSeconds = (isNegative ? -diffMillis : diffMillis) / 1000;
        var seconds = diffSeconds % 60;
        var diffMinutes = (diffSeconds - seconds) / 60;
        var sign = isNegative ? "-" : "";
        return sign + diffMinutes + ":" + formatSeconds(seconds);

        function getDiffMillis() {
            var diffMillis = getMillisFromMidnight(hhmm) - currentTimeMillis % MILLIS_PER_DAY;
            if (diffMillis < -1e6) {
                diffMillis += MILLIS_PER_DAY
            }
            return diffMillis;
        }

        function formatSeconds(seconds) {
            return padZero(seconds.toFixed(1));

            function padZero(r) {
                if (r.length < 4) {
                    return "0" + r;
                } else {
                    return r;
                }
            }
        }
    }
}

function getMillisSinceRefresh(currentDate, refreshMillis) {
    var currentMillis = currentDate.getTime() - (currentDate.getTimezoneOffset() * MILLIS_PER_MINUTE);
    var currentMillisToday = currentMillis % MILLIS_PER_DAY;
    var millis = currentMillisToday - refreshMillis;

    if (millis < 0) {
        return millis + MILLIS_PER_DAY;
    }

    return millis;
}

function previous() {
    setStation(stationId + 1);
}

function next() {
    setStation(stationId - 1);
}

function isOutdated(millisSinceRefresh, millisSinceRequest, millisSinceResponse) {
    return millisSinceRefresh > 60000 && millisSinceRequest > 30000 && millisSinceResponse > 10000;
}

function createMillis() {
    var that = {};

    var requestMillis = 0;
    var responseMillis = 0;

    that.getRequest = function () {
        return new Date().getTime() - requestMillis;
    };

    that.getResponse = function () {
        return new Date().getTime() - responseMillis;
    };

    that.requestSent = function () {
        requestMillis = new Date().getTime();
    };

    that.responseReceived = function () {
        responseMillis = new Date().getTime();
    };

    return that;
}
