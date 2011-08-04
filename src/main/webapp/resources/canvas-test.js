function tests() {

    test("drawNoDepartures", function() {
        var mock = {
            calls: 0,
            fillRect: function () {},
            fillText: function () {
                ++this.calls;
            }
        };
        equals(mock.calls, 0, "fillText should not have been called yet");
        draw(mock);
        equals(mock.calls, 1, "fillText should have been called once");
    });

    test("draw time", function() {
        var time = "22:48";
        var mock = {
            calls: 0,
            fillRect: function () {},
            fillText: function (text) {
                if (time === text) {
                    ++this.calls;
                }
            }
        };
        state.departures = [{time: time}];
        draw(mock);
        equals(mock.calls, 1, "fillText should be called once with value " + time);
    });

    test("draw destination", function() {
        var destination = "Tumba";
        var mock = {
            calls: 0,
            fillRect: function () {},
            fillText: function (text) {
                if (destination === text) {
                    ++this.calls;
                }
            }
        };
        state.departures = [{time: "22:48", destination: destination}];
        draw(mock);
        equals(mock.calls, 1, "fillText should be called once with value " + destination);
    });

}

$(document).ready(tests);
