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

    test("draw no departures", function() {
        var contextMock = {
            calls: 0,
            fillRect: function () {},
            fillText: function () {
                ++this.calls;
            },
            measureText: function () {
                return {width: 200};
            }
        };

        equals(contextMock.calls, 0, "fillText should not have been called yet");
        draw(createCanvasMock(contextMock));
        equals(contextMock.calls, 2, "fillText should be called twice");
    });

    test("draw time and destination", function() {
        var time = "22:48";
        var destination = "Tumba";
        var contextMock = {
            calls: 0,
            fillRect: function () {},
            fillText: function (text) {
                if (text.match(new RegExp(time + '.*' + destination))) {
                    ++this.calls;
                }
            },
            measureText: function () {
                return {width: 200};
            }
        };
        state.stationName = 'Tumba';
        state.departures = [{time: time, fullDestination: destination}];
        draw(createCanvasMock(contextMock));
        equals(contextMock.calls, 1, "fillText should be called once with value " + time);
    });

    test("draw lines", function() {
        var contextMock = {
            y1: 0,
            y2: 0,
            fillRect: function () {},
            fillText: function (text, x, y) {
                if (text.match(/Line 1/)) {
                    this.y1 = y;
                }
                if (text.match(/Line 2/)) {
                    this.y2 = y;
                }
            },
            measureText: function () {
                return {width: 200};
            }
        };
        state.stationName = 'Tumba';
        state.departures = [
            {time: "22:48", fullDestination: "Line 1"},
            {time: "22:49", fullDestination: "Line 2"}
        ];
        draw(createCanvasMock(contextMock));
        equals(contextMock.y1, 360);
        equals(contextMock.y2, 480);
    });

    test("draw station", function() {
        var contextMock = {
            x: 10,
            y: 0,
            fillRect: function () {},
            fillText: function (text, x, y) {
                if (text.match(/Tumba/)) {
                    this.x = x;
                    this.y = y;
                }
            },
            measureText: function () {
                return {width: 200};
            }
        };
        state.stationName = 'Tumba';
        state.departures = [
            {time: "22:48", fullDestination: "Line 1"},
            {time: "22:49", fullDestination: "Line 2"}
        ];
        draw(createCanvasMock(contextMock));
        ok(contextMock.x < 10, 'should be left aligned');
        equals(contextMock.y, 120);
    });

    test("draw countdown", function() {
        var contextMock = {
            text: "nyi",
            fillRect: function () {},
            fillText: function (text) {
                this.text = text;
            },
            measureText: function () {
                return {width: 200};
            }
        };
        state.departures = [
            {time: "22:48", fullDestination: "Line 1"}
        ];
        state.currentDate = new Date(2010, 5, 27, 22, 40, 0, 0);
        draw(createCanvasMock(contextMock));
        equals(contextMock.text, "8:00.0", "should be 8 minutes to departure");
    });

    test("align countdown", function() {
        var contextMock = {
            x: 0,
            fillRect: function () {},
            fillText: function (text, x) {
                if (text === "8:00.0") {
                    this.x = x;
                }
            },
            measureText: function () {
                return {width: 200};
            }
        };
        state.departures = [
            {time: "22:48", fullDestination: "Line 1"}
        ];
        state.currentDate = new Date(2010, 5, 27, 22, 40, 0, 0);
        draw(createCanvasMock(contextMock));
        ok(contextMock.x <= 600, "should not draw outside right edge: " + contextMock.x);
    });

}

$(document).ready(tests);
