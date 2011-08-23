function getFontSize(font) {
    var matches = font.match(/([\.\d]+)px/);
    return matches[1];
}
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

    function width(value) {
        return function () {
            return {width: value};
        }
    }

    module("canvas");

    test("draw no departures", function() {
        var calls = 0;
        var contextMock = {
            fillRect: nop,
            fillText: function () {
                ++calls;
            },
            measureText: width(200)
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
            measureText: width(200)
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
            measureText: width(200)
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
            measureText: width(200)
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
            measureText: width(200)
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
            measureText: width(200)
        };
        state.departures = [
            {time: "22:48", fullDestination: "Line 1"}
        ];
        state.currentDate = new Date(2010, 5, 27, 22, 40, 0, 0);
        draw(createCanvasMock(contextMock));
        ok(countdownX <= 600, "should not draw outside right edge: " + countdownX);
    });

    test("scale to fit height", function() {
        var contextMock = {
            fillRect: nop,
            fillText: function (text, x) {
            },
            measureText: width(200)
        };
        state.departures = [
            {time: "22:48", fullDestination: "Line 1"}
        ];
        draw(createCanvasMock(contextMock));
        var font = contextMock.font;
        var r = getFontSize(font);
        var msg = "should be scaled according to height if it fits horizontally: " + r;
        ok(r > 150, msg);
        ok(r <= 160, msg);
    });

    test("scale to fit width", function() {
        var contextMock = {
            fillRect: nop,
            fillText: function (text, x) {
            },
            measureText: function (text) {
                var current = getFontSize(this.font);
                if (text.match(/wide/)) {
                    return {width: current * 950 / 100};
                } else {
                    return {width: current * 50 / 100};
                }
            }
        };
        state.departures = [
            {time: "22:48", fullDestination: "wide"},
            {time: "22:48", fullDestination: "narrow"}
        ];
        draw(createCanvasMock(contextMock));
        var r = getFontSize(contextMock.font);
        var msg = "should be scaled according to width of longest line if it doesn't fit horizontally: " + r;
        ok(r > 70, msg);
        ok(r < 80, msg);
    });

    test("touch", function() {
        ok(touchHandler);
        equals(touchHandler.x, 11);
        var mock = {
            touches: [{
                clientX: 1,
                clientY: 2
            }],
            preventDefault: nop
        };
        touchHandler.handleTouch(mock);
        equals(touchHandler.x, 1);
    });

}

$(document).ready(tests);
