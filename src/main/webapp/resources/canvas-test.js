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

    test("drawNoDepartures", function() {
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
        equals(contextMock.calls, 1, "fillText should be called once");
    });

    test("draw time", function() {
        var time = "22:48";
        var contextMock = {
            calls: 0,
            fillRect: function () {},
            fillText: function (text) {
                if (text === time) {
                    ++this.calls;
                }
            },
            measureText: function () {
                return {width: 200};
            }
        };
        state.departures = [{time: time}];
        draw(createCanvasMock(contextMock));
        equals(contextMock.calls, 1, "fillText should be called once with value " + time);
    });

    test("draw destination", function() {
        var destination = "Tumba";
        var contextMock = {
            calls: 0,
            fillRect: function () {},
            fillText: function (text) {
                if (text === destination) {
                    ++this.calls;
                }
            },
            measureText: function () {
                return {width: 200};
            }
        };
        state.departures = [{time: "22:48", destination: destination}];
        draw(createCanvasMock(contextMock));
        equals(contextMock.calls, 1, "fillText should be called once with value " + destination);
    });

    test("draw lines", function() {
        var contextMock = {
            y1: 0,
            y2: 0,
            fillRect: function () {},
            fillText: function (text, x, y) {
                if (text === "Line 1") {
                    this.y1 = y;
                }
                if (text === "Line 2") {
                    this.y2 = y;
                }
            },
            measureText: function () {
                return {width: 200};
            }
        };
        state.departures = [
            {time: "22:48", destination: "Line 1"},
            {time: "22:49", destination: "Line 2"}
        ];
        draw(createCanvasMock(contextMock));
        equals(contextMock.y1, 240);
        equals(contextMock.y2, 360);
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
            {time: "22:48", destination: "Line 1"}
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
            {time: "22:48", destination: "Line 1"}
        ];
        state.currentDate = new Date(2010, 5, 27, 22, 40, 0, 0);
        draw(createCanvasMock(contextMock));
        ok(contextMock.x <= 600, "should not draw outside right edge: " + contextMock.x);
    });

}

$(document).ready(tests);
