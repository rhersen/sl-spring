describe('timecalc', function() {

    function equals(actual, expected) {
        expect(actual).toBe(expected);
    }

    function ok(actual) {
        expect(actual).toBeTruthy();
    }

    var test = it;

    function createTimeMock(time, timezoneOffset) {
        var mock = new Object;
        mock.getTime = function () {
            return time;
        };
        mock.getTimezoneOffset = function () {
            return timezoneOffset
        };
        return mock;
    }

    it("should count from midnight", function() {
        expect(getCountdown("00:01", 0)).toBe("1:00.0");
        expect(getCountdown("0:02", 0)).toBe("2:00.0");
        expect(getCountdown("00:20", 0)).toBe("20:00.0");
        expect(getCountdown("0:59", 0)).toBe("59:00.0");
        expect(getCountdown("00:50", 0)).toBe("50:00.0");
        expect(getCountdown("01:00", 0)).toBe("60:00.0");
        expect(getCountdown("01:10", 0)).toBe("70:00.0");
        expect(getCountdown("01:39", 0)).toBe("99:00.0");
    });

    it("30 seconds after midnight", function() {
        expect(getCountdown("00:01", 30000)).toBe("0:30.0");
        expect(getCountdown("00:01", 30500)).toBe("0:29.5");
    });

    it("five minutes after midnight", function() {
        expect(getCountdown("00:05", 300000)).toBe("0:00.0");
        expect(getCountdown("00:10", 300000)).toBe("5:00.0");
        expect(getCountdown("00:04", 300000)).toBe("-1:00.0");
    });

    it("ten to one", function() {
        expect(getCountdown("00:50", 3000000)).toBe("0:00.0");
        expect(getCountdown("00:55", 3000000)).toBe("5:00.0");
        expect(getCountdown("00:59", 3000000)).toBe("9:00.0");
        expect(getCountdown("01:00", 3000000)).toBe("10:00.0");
        expect(getCountdown("01:10", 3000000)).toBe("20:00.0");
    });

    it("one", function() {
        expect(getCountdown("00:59", 3600000)).toBe("-1:00.0");
        expect(getCountdown("01:00", 3600000)).toBe("0:00.0");
        expect(getCountdown("01:10", 3600000)).toBe("10:00.0");
        expect(getCountdown("02:10", 3600000)).toBe("70:00.0");
    });

    it("two and a half minutes after midnight", function() {
        expect(getCountdown("00:01", 200000)).toBe("-2:20.0");
        expect(getCountdown("00:02", 200000)).toBe("-1:20.0");
        expect(getCountdown("00:03", 200000)).toBe("-0:20.0");
    });

    it("regression", function() {
        expect(getCountdown("00:01", 82000000)).toBe("74:20.0");
    });

    it("ten", function() {
        expect(getCountdown("10:00", 36000000)).toBe("0:00.0");
        expect(getCountdown("11:00", 36000000)).toBe("60:00.0");
    });

    it("getCountdown with invalid time", function() {
        expect(getCountdown("", 300000)).toBe("?");
    });

    it("getMillisFromMidnight", function() {
        expect(getMillisFromMidnight("00:01")).toBe(60000);
        expect(getMillisFromMidnight("00:02")).toBe(120000);
        expect(getMillisFromMidnight("00:09")).toBe(9 * 60000);
        expect(getMillisFromMidnight("00:10")).toBe(600000);
        expect(getMillisFromMidnight("00:59")).toBe(3540000);
        expect(getMillisFromMidnight("01:00")).toBe(3600000);
    });

    it("getMillisSinceRefresh", function() {
        expect(getMillisSinceRefresh(createTimeMock(0, 0), 0)).toBe(0);
        expect(getMillisSinceRefresh(createTimeMock(60000, 0), 60000)).toBe(0);
        expect(getMillisSinceRefresh(createTimeMock(60000, 0), 0)).toBe(60000);
        expect(getMillisSinceRefresh(createTimeMock(3600000, 60), 0)).toBe(0);
        expect(getMillisSinceRefresh(createTimeMock(3660000, 60), 0)).toBe(60000);
        expect(getMillisSinceRefresh(createTimeMock(1310854593304, -120), 240000)).toBe(753304);
        expect(getMillisSinceRefresh(createTimeMock(2 * 60 * 60 * 1000, 0),
            60 * 60 * 1000)).toBe(60 * 60 * 1000);
        expect(getMillisSinceRefresh(createTimeMock(60 * 60 * 1000, 0),
            23 * 60 * 60 * 1000)).toBe(2 * 60 * 60 * 1000);
    });

    it("isOutdated", function() {
        expect(isOutdated(66000, 66000, 66000)).toBeTruthy();
        expect(isOutdated(44000, 44000, 44000)).toBeFalsy();
        expect(isOutdated(6000, 6000, 6000)).toBeFalsy();
    });

    it("millis", function() {
        var target = createMillis();
        var start, middle, end;
        start = new Date().getTime();
        target.requestSent();
        while (new Date().getTime() === start) {
        }
        middle = new Date().getTime();
        target.responseReceived();
        while (new Date().getTime() === middle) {
        }
        end = new Date().getTime();

        expect(target.getRequest() > 0).toBeTruthy();
        expect(target.getRequest() >= target.getResponse()).toBeTruthy();
        expect(target.getResponse() <= end).toBeTruthy();
    });

});
