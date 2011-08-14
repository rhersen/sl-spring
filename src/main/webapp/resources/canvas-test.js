function tests() {
    function createCanvasMock(context) {
        return {
            height: 480,
            width: 800,
            getContext: function () {
                return context;
            }
        };
    }

    var nop = function () {};

    var width200 = function () {
        return {width: 200};
    };

    test("draw no departures", function() {
        var calls = 0;
        var contextMock = {
            fillRect: nop,
            fillText: function () {
                ++calls;
            },
            measureText: width200
        };

        equals(calls, 0, "fillText should not have been called yet");
        draw(createCanvasMock(contextMock));
        equals(calls, 2, "fillText should be called twice");
    });

    test("draw time and destination", function() {
        var time = "22:48";
        var destination = "Tumba";
        var calls = 0;
        var contextMock = {
            fillRect: nop,
            fillText: function (text) {
                if (text.match(new RegExp(time + '.*' + destination))) {
                    ++calls;
                }
            },
            measureText: width200
        };
        state.stationName = 'Tumba';
        state.departures = [{time: time, fullDestination: destination}];
        draw(createCanvasMock(contextMock));
        equals(calls, 1, "fillText should be called once with value " + time);
    });

    test("draw lines", function() {
        var y1 = 0;
        var y2 = 0;
        var contextMock = {
            fillRect: nop,
            fillText: function (text, x, y) {
                if (text.match(/Line 1/)) {
                    y1 = y;
                }
                if (text.match(/Line 2/)) {
                    y2 = y;
                }
            },
            measureText: width200
        };
        state.stationName = 'Tumba';
        state.departures = [
            {time: "22:48", fullDestination: "Line 1"},
            {time: "22:49", fullDestination: "Line 2"}
        ];
        draw(createCanvasMock(contextMock));
        equals(y1, 360);
        equals(y2, 480);
    });

    test("draw station", function() {
        var xTumba = 10;
        var yTumba = 0;
        var contextMock = {
            fillRect: nop,
            fillText: function (text, x, y) {
                if (text.match(/Tumba/)) {
                    xTumba = x;
                    yTumba = y;
                }
            },
            measureText: width200
        };
        state.stationName = 'Tumba';
        state.departures = [
            {time: "22:48", fullDestination: "Line 1"},
            {time: "22:49", fullDestination: "Line 2"}
        ];
        draw(createCanvasMock(contextMock));
        ok(xTumba < 10, 'should be left aligned');
        equals(yTumba, 120);
    });

    test("draw countdown", function() {
        var countdown;
        var contextMock = {
            fillRect: nop,
            fillText: function (text) {
                countdown = text;
            },
            measureText: width200
        };
        state.departures = [
            {time: "22:48", fullDestination: "Line 1"}
        ];
        state.currentDate = new Date(2010, 5, 27, 22, 40, 0, 0);
        draw(createCanvasMock(contextMock));
        equals(countdown, "8:00.0", "should be 8 minutes to departure");
    });

    test("align countdown", function() {
        var countdownX;
        var contextMock = {
            fillRect: nop,
            fillText: function (text, x) {
                if (text === "8:00.0") {
                    countdownX = x;
                }
            },
            measureText: width200
        };
        state.departures = [
            {time: "22:48", fullDestination: "Line 1"}
        ];
        state.currentDate = new Date(2010, 5, 27, 22, 40, 0, 0);
        draw(createCanvasMock(contextMock));
        ok(countdownX <= 600, "should not draw outside right edge: " + countdownX);
    });

}

$(document).ready(tests);
