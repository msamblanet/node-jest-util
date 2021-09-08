import * as Lib from "../src/MockTime"
import LibDefault from "../src/MockTime"

test("Verify exports", () => {
    expect(Lib).not.toBeNull();
    expect(Lib.MockTime).not.toBeNull();

    expect(LibDefault).toEqual(Lib.MockTime);
});

test("Time mocking", async () => {
    const mock = new Lib.MockTime();

    mock.with(() => {
        expect(Date.now()).toEqual(0);
        expect(Date.now()).toEqual(1);
        expect(Date.now()).toEqual(2);
        mock.nowIncrement = 2;
        expect(Date.now()).toEqual(3);
        expect(Date.now()).toEqual(5);
        expect(Date.now()).toEqual(7);
        mock.nextNowValue = 0;
        expect(Date.now()).toEqual(0);
        expect(Date.now()).toEqual(2);
        expect(Date.now()).toEqual(4);
    });
    expect(Date.now()).toBeGreaterThan(100000);

    await mock.withAsync(async () => {
        expect(Date.now()).toEqual(0);
        expect(Date.now()).toEqual(1);
        expect(Date.now()).toEqual(2);
        mock.nowIncrement = 2;
        expect(Date.now()).toEqual(3);
        expect(Date.now()).toEqual(5);
        expect(Date.now()).toEqual(7);
        mock.nextNowValue = 0;
        expect(Date.now()).toEqual(0);
        expect(Date.now()).toEqual(2);
        expect(Date.now()).toEqual(4);
    });
    expect(Date.now()).toBeGreaterThan(100000);
})

test("Double mock", () => {
    const mock = new Lib.MockTime();
    mock.mock();
    expect(() => mock.mock()).toThrowError("Already mocked");
});

test("Unmock nothing", () => {
    const mock = new Lib.MockTime();
    expect(() => mock.reset()).toThrowError("Not mocked");
});
