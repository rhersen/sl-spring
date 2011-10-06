describe('canvas', function() {

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

    function getFontSize(font) {
        var matches = font.match(/([\.\d]+)px/);
        return matches[1];
    }

    it("draw no departures", function() {
        var calls = 0;
        var contextMock = {
            fillRect: nop,
            fillText: function () {
                ++calls;
            },
            measureText: width(200)
        };

        expect(calls).toBe(0);
        draw(createCanvasMock(contextMock));
        expect(calls).toBe(2);
    });

    it("draw time and destination", function() {
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
        expect(calls).toBe(1);
    });

    it("draw lines", function() {
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
        expect(y1).toBe(360);
        expect(y2).toBe(480);
    });

    it("draw station", function() {
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
        expect(xTumba < 10).toBeTruthy();
        expect(yTumba).toBe(120);
    });

    it("draw countdown", function() {
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
        expect(countdown).toBe("8:00.0");
    });

    it("align countdown", function() {
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
        expect(countdownX <= 600).toBeTruthy();
    });

    it("scale to fit height", function() {
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
        expect(r > 150).toBeTruthy();
        expect(r <= 160).toBeTruthy();
    });

    it("scale to fit width", function() {
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
        expect(r > 70).toBeTruthy();
        expect(r < 80).toBeTruthy();
    });

    it("touch", function() {
        expect(touchHandler).toBeTruthy();
        expect(touchHandler.x).toBe(11);
        var mock = {
            touches: [{
                clientX: 1,
                clientY: 2
            }],
            preventDefault: nop
        };
        touchHandler.handleTouch(mock);
        expect(touchHandler.x).toBe(1);
    });

});
