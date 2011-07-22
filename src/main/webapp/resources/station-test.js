function tests() {

    test("set status", function() {
        var bg = $("#bg");
        equals(bg.length, 1);
        ok(!bg.hasClass("pending"));
        ok(!bg.hasClass("error"));

        var target = createStatus();

        target.set("", bg);
        ok(bg.hasClass("pending"), "empty string should mean pending");
        ok(!bg.hasClass("error"), "empty string should not mean error");
        ok(!bg.hasClass("expired"), "empty string should not mean expired");

        target.set("success", bg);
        ok(!bg.hasClass("pending"), "success should not mean pending");
        ok(!bg.hasClass("error"), "success should not mean error");
        ok(!bg.hasClass("expired"), "success should not mean expired");

        target.set("error", bg);
        ok(!bg.hasClass("pending"), "error should not mean pending");
        ok(bg.hasClass("error"), "error should mean error");
        ok(!bg.hasClass("expired"), "error should not mean expired");

        target.set("expired", bg);
        ok(!bg.hasClass("pending"), "expired should not mean pending");
        ok(!bg.hasClass("error"), "expired should not mean error");
        ok(bg.hasClass("expired"), "expired should mean expired");

        target.set("no data", bg);
        ok(!bg.hasClass("pending"), "no data should not mean pending");
        ok(bg.hasClass("error"), "no data should mean error");
        ok(!bg.hasClass("expired"), "no data should not mean expired");
    });

    test("getDirection", function() {
        equals(getDirection(), "ns", "no checkboxes set");

        $("#northbound").prop("checked", true);
        ok(isNorthChecked(), "north set");
        ok(!isSouthChecked(), "north set");
        equals(getDirection(), "n", "north set");
        ok(isNorthChecked(), "both checkboxes set");

        $("#southbound").prop("checked", true);
        ok(isSouthChecked(), "both checkboxes set");
        equals(getDirection(), "ns", "both checkboxes set");

        $("#northbound").prop("checked", false);
        ok(!isNorthChecked(), "south set");
        ok(isSouthChecked(), "south set");
        equals(getDirection(), "s", "south set");
    });

    test("setDirection", function() {
        setDirection('n');
        ok(isNorthChecked(), "north should have been set");
        ok(!isSouthChecked(), "south should not have been set");
        setDirection('s');
        ok(!isNorthChecked(), "north should have been reset");
        ok(isSouthChecked(), "south should have been set");
        setDirection('ns');
        ok(isNorthChecked(), "north should have been set");
        ok(isSouthChecked(), "south should have been set");
    });

    test("millis", function() {
        var target = createMillis();
        var start, middle, end;
        start = new Date().getTime();
        target.requestSent();
        while (new Date().getTime() === start) {}
        middle = new Date().getTime();
        target.responseReceived();
        while (new Date().getTime() === middle) {}
        end = new Date().getTime();

        ok(start <= target.getRequest(), "request sent after start");
        ok(target.getRequest() <= target.getResponse(), "response should be received after request");
        ok(target.getResponse() <= end, "response should be received before end");
    });

    test("updateCountdown", function() {
        var rows = $('#departures tr');
        equals(rows.size(), 2, "fixture should contain two rows");
        var now = new Date(1300000000000);
        var countdown1 = $('#departures tr:first td:last');
        var countdown2 = $('#departures tr:last td:last');
        equals(countdown1.html(), "countdown1", "first row of fixture");
        updateCountdown(now);
        equals(countdown1.html(), "0:20.0", "first departure should be in 20 seconds");
        equals(countdown2.html(), "4:20.0", "second departure should be in 4 minutes");
    });

    test("updatePage", function() {
        var rows;
        rows = $('#departures tr');
        equals(rows.size(), 2, "table should contain two rows before update");
        updatePage({"updated":"22:10","stationName":"Tullinge","departures":[
                    {"time":"22:26","destination":"Märsta","delayed":false,"direction":"n","millis":1560000},
                    {"time":"22:56","destination":"Märsta","delayed":false,"direction":"n","millis":3360000},
                    {"time":"23:28;","destination":"Märsta","delayed":true,"direction":"n","millis":1560000}
                ]});
        rows = $('#departures tr');
        equals(rows.size(), 3, "table should contain three rows after update");
        equals($('#departures tr[class=punctual]').size(), 2, "two departures should be punctual");
        equals($('#departures tr[class=delayed]').size(), 1, "one departure should be delayed");
        equals($('#departures tr:first td:first').html(), "22:26", "first cell should be departure time");
        equals($('#departures tr:first td:eq(1)').html(), "Märsta", "second cell should be destination");
        equals($('#departures tr:first td:last').html(), "countdown", "last cell should be countdown");
    });

    test("filterDirection", function() {
        var rows;
        rows = $('#departures tr');
        equals(rows.size(), 2, "table should contain two rows before update");
        var data = {"departures":[
            {"time":"23:56","destination":"Märsta","delayed":false,"direction":"n"},
            {"time":"00:26","destination":"Märsta","delayed":false,"direction":"n"},
            {"time":"00:56","destination":"Märsta","delayed":false,"direction":"n"},
            {"time":"00:07","destination":"Södertälje hamn","delayed":true,"direction":"s"},
            {"time":"00:33","destination":"Södertälje hamn","delayed":false,"direction":"s"}
        ],"updated":"23:56","stationName":"Tullinge"};
        updatePage(data);
        rows = $('#departures tr');
        equals(rows.size(), 5, "table should contain five rows after update");

        $("#northbound").prop("checked", true);
        $("#southbound").prop("checked", false);
        updatePage(data);
        rows = $('#departures tr');
        equals(rows.size(), 3, "table should contain three northbound rows");

        $("#northbound").prop("checked", false);
        $("#southbound").prop("checked", true);
        updatePage(data);
        rows = $('#departures tr');
        equals(rows.size(), 2, "table should contain three southbound rows");
    });

}

$(document).ready(tests);
