describe('HelloWorld', function() {

    it('should say hello', function() {
        var helloWorld = 'whatever';
        expect(helloWorld).toBeTruthy();
    });

    it("should count from midnight", function() {
        expect(getCountdown("00:01", 0)).toBe("1:00.0");
        expect(getCountdown("0:02", 0)).toBe("2:00.0");
        expect(getCountdown("00:20", 0)).toBe("20:00.0");
        expect(getCountdown("0:59", 0)).toBe("59:00.0");
        expect(getCountdown("00:50", 0)).toBe("50:00.0");
        expect(getCountdown("01:00", 0)).toBe("60:00.0");
        expect(getCountdown("01:10", 0)).toBe("70:00.0");
        expect(getCountdown("01:59", 0)).toBe("99:00.0");
    });

});
