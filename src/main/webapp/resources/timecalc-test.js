function tests() {

    function createTimeMock(time, timezoneOffset) {
        var mock = new Object;
        mock.getTime = function () {return time;};
        mock.getTimezoneOffset = function () {return timezoneOffset};
        return mock;
    }

    test("from midnight", function() {
            equals(getCountdown("00:01", 0), "1:00.0");
            equals(getCountdown("0:02", 0), "2:00.0");
            equals(getCountdown("00:20", 0), "20:00.0");
            equals(getCountdown("0:59", 0), "59:00.0");
            equals(getCountdown("00:50", 0), "50:00.0");
            equals(getCountdown("01:00", 0), "60:00.0");
            equals(getCountdown("01:10", 0), "70:00.0");
            equals(getCountdown("01:39", 0), "99:00.0");
        });

    test("30 seconds after midnight", function() {
            equals(getCountdown("00:01", 30000), "0:30.0");
            equals(getCountdown("00:01", 30500), "0:29.5");
        });

    test("five minutes after midnight", function() {
            equals(getCountdown("00:05", 300000), "0:00.0");
            equals(getCountdown("00:10", 300000), "5:00.0");
            equals(getCountdown("00:04", 300000), "-1:00.0");
        });

    test("ten to one", function() {
            equals(getCountdown("00:50", 3000000), "0:00.0");
            equals(getCountdown("00:55", 3000000), "5:00.0");
            equals(getCountdown("00:59", 3000000), "9:00.0");
            equals(getCountdown("01:00", 3000000), "10:00.0");
            equals(getCountdown("01:10", 3000000), "20:00.0");
        });

    test("one", function() {
            equals(getCountdown("00:59", 3600000), "-1:00.0");
            equals(getCountdown("01:00", 3600000), "0:00.0");
            equals(getCountdown("01:10", 3600000), "10:00.0");
            equals(getCountdown("02:10", 3600000), "70:00.0");
        });

    test("two and a half minutes after midnight", function() {
            equals(getCountdown("00:01", 200000), "-2:20.0");
            equals(getCountdown("00:02", 200000), "-1:20.0");
            equals(getCountdown("00:03", 200000), "-0:20.0");
        });

    test("regression", function() {
            equals(getCountdown("00:01", 82000000), "74:20.0");
        });

    test("ten", function() {
            equals(getCountdown("10:00", 36000000), "0:00.0");
            equals(getCountdown("11:00", 36000000), "60:00.0");
        });

    test("getCountdown with invalid time", function() {
            equals(getCountdown("", 300000), "?");
        });

    test("getMillisFromMidnight", function() {
            equals(getMillisFromMidnight("00:01"), 60000);
            equals(getMillisFromMidnight("00:02"), 120000);
            equals(getMillisFromMidnight("00:09"), 9 * 60000);
            equals(getMillisFromMidnight("00:10"), 600000);
            equals(getMillisFromMidnight("00:59"), 3540000);
            equals(getMillisFromMidnight("01:00"), 3600000);
        });

    test("getMillisSinceRefresh", function() {
            equals(getMillisSinceRefresh(createTimeMock(0, 0), 0), 0);
            equals(getMillisSinceRefresh(createTimeMock(60000, 0), 60000), 0);
            equals(getMillisSinceRefresh(createTimeMock(60000, 0), 0), 60000);
            equals(getMillisSinceRefresh(createTimeMock(3600000, 60), 0), 0);
            equals(getMillisSinceRefresh(createTimeMock(3660000, 60), 0),
                   60000);
            equals(getMillisSinceRefresh(createTimeMock(2 * 60 * 60 * 1000, 0),
                                         60 * 60 * 1000),
                   60 * 60 * 1000);
            equals(getMillisSinceRefresh(createTimeMock(60 * 60 * 1000, 0),
                                         23 * 60 * 60 * 1000),
                   2 * 60 * 60 * 1000);
    });

    test("isOutdated", function() {
        ok(isOutdated(66000, 66000, 66000), "more than one minute");
        ok(!isOutdated(44000, 44000, 44000), "less than one minute");
        ok(!isOutdated(6000, 6000, 6000), "less than ten seconds");
    });

}

$(document).ready(tests);
