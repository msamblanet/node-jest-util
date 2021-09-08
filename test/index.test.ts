import * as Lib from "../src/index"
//import LibDefault from "../src/index"

test("Verify exports", () => {
    expect(Lib).not.toBeNull();
    expect(Lib.AbstractMock).not.toBeNull();
    expect(Lib.MockFs).not.toBeNull();
    expect(Lib.MockTime).not.toBeNull();

    //expect(LibDefault).toBeNull();
});
