function createStatus() {
    var s = "n/a";

    function get() {
        return s;
    }

    function set(status, bg) {
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
    }

    return {
        get: get,
        set: set
    };
}

function createStation(id, direction) {
    var stationId = 9525;
    var millis = undefined;
    var responseStatus = createStatus();
    var updated = "";

    stationId = id;
    setDirection(direction);
    updateClock();
    setInterval(updateClock, 256);
    function updatePage(data) {
        var nChecked = isNorthChecked();
        var sChecked = isSouthChecked();

        function getDelayed(delayed) {
            return delayed ? "delayed" : "punctual";
        }

        $("#station").html(data.stationName);

        updated = data.updated;
        $("#updated").html(updated);

        $('#departures tr').remove();

        $(data.departures).each(function (i, departure) {
            var row;
            if ((nChecked && departure.direction === 'n') ||
                (sChecked && departure.direction === 's')) {
                row = $('<tr/>').appendTo($('#departures'));
                row.addClass(getDelayed(departure.delayed));
                $('<td/>').appendTo(row).html(departure.time);
                $('<td/>').appendTo(row).html(departure.destination);
                $('<td/>').appendTo(row).html('countdown').addClass('countdown');
            }
        });
    }

    function getMillisSinceUpdate(updated) {
        return getMillisSinceRefresh(new Date(), getMillisFromMidnight(updated));
    }

    function setStation(id) {
        function getAjaxUrl() {
            return "departures?id=" + stationId + "&direction=" + getDirection();
        }

        function handleSuccess(data, status) {
            millis.responseReceived();

            if (!data) {
                responseStatus.set("no data", $("#bg"));
                return;
            }

            if (getMillisSinceUpdate(data.updated) > 200000) {
                responseStatus.set("expired", $("#bg"));
            } else {
                responseStatus.set(status, $("#bg"));
            }

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

        $.ajax({url: getAjaxUrl(), cache: false, success: handleSuccess, error: handleError});
    }

    function previous() {
        setStation(stationId + 1);
    }

    function next() {
        setStation(stationId - 1);
    }

    function isNorthChecked() {
        return $("#northbound").prop("checked") || !$("#southbound").prop("checked");
    }

    function isSouthChecked() {
        return $("#southbound").prop("checked") || !$("#northbound").prop("checked");
    }

    function getDirection() {
        return (isNorthChecked() ? "n" : "") + (isSouthChecked() ? "s" : "");
    }

    function setDirection(direction) {
        $("#northbound").prop("checked", /n/.test(direction));
        $("#southbound").prop("checked", /s/.test(direction));
    }

    function updateCountdown(currentDate) {
        $("#departures tr").each(function () {
            var countdown = getCountdown($(this).children(':first').html(), getCurrentTimeMillis(currentDate));
            $(this).children(':last').html(countdown);
        });
    }

    function shouldUpdate() {
        return isOutdated(getMillisSinceUpdate(updated), millis.getRequest(), millis.getResponse());
    }

    function updateClock() {
        var currentDate = new Date();
        updateCountdown(currentDate);

        if (!millis) {
            millis = createMillis();
            setStation(stationId);
            return;
        }

        $('#ago').text(getMillisSinceUpdate(updated) + " " + millis.getRequest() + " " + millis.getResponse() + " " + responseStatus.get());

        if (shouldUpdate()) {
            setStation(stationId);
        }
    }

    return {
        getDirection: getDirection,
        setDirection: setDirection,
        setStation: setStation,
        previous: previous,
        next: next,
        isNorthChecked: isNorthChecked,        //todo: only called from tests
        isSouthChecked: isSouthChecked,        //todo: only called from tests
        updateClock: updateClock,
        updateCountdown: updateCountdown,
        updatePage: updatePage
    };
}
