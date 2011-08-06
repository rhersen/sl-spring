function tests() {
    function createCanvasMock(context) {
        return {
            height: 480,
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

}

$(document).ready(tests);
