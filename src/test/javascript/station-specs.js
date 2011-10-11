describe('station', function() {

    var station = createStation();

    it("set status", function() {
        setFixtures('<div id="bg"></div>');

        var bg = $("#bg");
        expect(bg.length).toEqual(1);
        expect(!bg.hasClass("pending")).toBeTruthy();
        expect(!bg.hasClass("error")).toBeTruthy();
        var target = createStatus();

        target.set("", bg);
        expect(bg.hasClass("pending")).toBeTruthy();
        expect(!bg.hasClass("error")).toBeTruthy();
        expect(!bg.hasClass("expired")).toBeTruthy();
        target.set("success", bg);
        expect(!bg.hasClass("pending")).toBeTruthy();
        expect(!bg.hasClass("error")).toBeTruthy();
        expect(!bg.hasClass("expired")).toBeTruthy();
        target.set("error", bg);
        expect(!bg.hasClass("pending")).toBeTruthy();
        expect(bg.hasClass("error")).toBeTruthy();
        expect(!bg.hasClass("expired")).toBeTruthy();
        target.set("expired", bg);
        expect(!bg.hasClass("pending")).toBeTruthy();
        expect(!bg.hasClass("error")).toBeTruthy();
        expect(bg.hasClass("expired")).toBeTruthy();
        target.set("no data", bg);
        expect(!bg.hasClass("pending")).toBeTruthy();
        expect(bg.hasClass("error")).toBeTruthy();
        expect(!bg.hasClass("expired")).toBeTruthy();
    });

    it("getDirection", function() {
        setFixtures('<label for="northbound">N</label><input type="checkbox" id="northbound" value="val" /> <label for="southbound">S</label><input type="checkbox" id="southbound" value="val" />');

        expect(station.getDirection()).toEqual("ns");
        $("#northbound").prop("checked", true);
        expect(station.isNorthChecked()).toBeTruthy();
        expect(!station.isSouthChecked()).toBeTruthy();
        expect(station.getDirection()).toEqual("n");
        expect(station.isNorthChecked()).toBeTruthy();
        $("#southbound").prop("checked", true);
        expect(station.isSouthChecked()).toBeTruthy();
        expect(station.getDirection()).toEqual("ns");
        $("#northbound").prop("checked", false);
        expect(!station.isNorthChecked()).toBeTruthy();
        expect(station.isSouthChecked()).toBeTruthy();
        expect(station.getDirection()).toEqual("s");
    });

    it("setDirection", function() {
        setFixtures('<label for="northbound">N</label><input type="checkbox" id="northbound" value="val" /> <label for="southbound">S</label><input type="checkbox" id="southbound" value="val" />');

        station.setDirection('n');
        expect(station.isNorthChecked()).toBeTruthy();
        expect(!station.isSouthChecked()).toBeTruthy();
        station.setDirection('s');
        expect(!station.isNorthChecked()).toBeTruthy();
        expect(station.isSouthChecked()).toBeTruthy();
        station.setDirection('ns');
        expect(station.isNorthChecked()).toBeTruthy();
        expect(station.isSouthChecked()).toBeTruthy();
    });

    it("updateCountdown", function() {
        setFixtures('<table id="departures"> <tr> <td>8:07</td> <td>station1</td> <td class="countdown">countdown1</td> </tr> <tr> <td>8:11</td> <td>station2</td> <td class="countdown">countdown2</td> </tr> </table> ');

        var rows = $('#departures tr');
        expect(rows.size()).toEqual(2);
        var now = new Date(1300000000000);
        var countdown1 = $('#departures tr:first td:last');
        var countdown2 = $('#departures tr:last td:last');
        expect(countdown1.html()).toEqual("countdown1");
        station.updateCountdown(now);
        expect(countdown1.html()).toEqual("0:20.0");
        expect(countdown2.html()).toEqual("4:20.0");
    });

    it("updatePage", function() {
        setFixtures('<table id="departures"> <tr> <td>8:07</td> <td>station1</td> <td class="countdown">countdown1</td> </tr> <tr> <td>8:11</td> <td>station2</td> <td class="countdown">countdown2</td> </tr> </table> ');

        var rows;
        rows = $('#departures tr');
        expect(rows.size()).toEqual(2);
        station.updatePage({"updated":"22:10","stationName":"Tullinge","departures":[
                    {"time":"22:26","destination":"Märsta","delayed":false,"direction":"n","millis":1560000},
                    {"time":"22:56","destination":"Märsta","delayed":false,"direction":"n","millis":3360000},
                    {"time":"23:28;","destination":"Märsta","delayed":true,"direction":"n","millis":1560000}
                ]});
        rows = $('#departures tr');
        expect(rows.size()).toEqual(3);
        expect($('#departures tr[class=punctual]').size()).toEqual(2);
        expect($('#departures tr[class=delayed]').size()).toEqual(1);
        expect($('#departures tr:first td:first').html()).toEqual("22:26");
        expect($('#departures tr:first td:eq(1)').html()).toEqual("Märsta");
        expect($('#departures tr:first td:last').html()).toEqual("countdown");
    });

    it("filterDirection", function() {
        setFixtures('<label for="northbound">N</label><input type="checkbox" id="northbound" value="val" /> <label for="southbound">S</label><input type="checkbox" id="southbound" value="val" /><table id="departures"> <tr> <td>8:07</td> <td>station1</td> <td class="countdown">countdown1</td> </tr> <tr> <td>8:11</td> <td>station2</td> <td class="countdown">countdown2</td> </tr> </table> ');

        var rows;
        rows = $('#departures tr');
        expect(rows.size()).toEqual(2);
        var data = {"departures":[
            {"time":"23:56","destination":"Märsta","delayed":false,"direction":"n"},
            {"time":"00:26","destination":"Märsta","delayed":false,"direction":"n"},
            {"time":"00:56","destination":"Märsta","delayed":false,"direction":"n"},
            {"time":"00:07","destination":"Södertälje hamn","delayed":true,"direction":"s"},
            {"time":"00:33","destination":"Södertälje hamn","delayed":false,"direction":"s"}
        ],"updated":"23:56","stationName":"Tullinge"};
        station.updatePage(data);
        rows = $('#departures tr');
        expect(rows.size()).toEqual(5);
        $("#northbound").prop("checked", true);
        $("#southbound").prop("checked", false);
        station.updatePage(data);
        rows = $('#departures tr');
        expect(rows.size()).toEqual(3);
        $("#northbound").prop("checked", false);
        $("#southbound").prop("checked", true);
        station.updatePage(data);
        rows = $('#departures tr');
        expect(rows.size()).toEqual(2);
    });

});