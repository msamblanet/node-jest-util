import * as Lib from "../src/MockFs"
import LibDefault from "../src/MockFs"

// Remember to setup your mock BEFORE importing fs
const mock = new Lib.MockFs(jest);

import path from "path";
import { Dirent } from "fs";
import fs from "fs";

test("Verify exports", () => {
    expect(Lib).not.toBeNull();
    expect(Lib.MockFs).not.toBeNull();

    expect(LibDefault).toEqual(Lib.MockFs);
});

test("Verify basic function", () => {
    let base = "";
    let originalFile = ""
    mock.with(() => {
        base = mock.populate({
            "foo": "bar"
        });

        originalFile = path.join(base, "foo");

        expect(fs.readFileSync(originalFile, { encoding: "utf8"})).toEqual("bar");
        expect(() => mock.getRealFs().readFileSync(originalFile, { encoding: "utf8"})).toThrowError(`ENOENT: no such file or directory, open '${originalFile}'`);
    });
    expect(() => mock.getRealFs().readFileSync(originalFile, { encoding: "utf8"})).toThrowError(`ENOENT: no such file or directory, open '${originalFile}'`);

    mock.with(() => {
        base = mock.populate({
            "foo2": "bar2"
        });

        expect(fs.readFileSync(path.join(base, "foo2"), { encoding: "utf8"})).toEqual("bar2");
        expect(() => fs.readFileSync(path.join(base, "foo"), { encoding: "utf8"})).toThrowError(`ENOENT: no such file or directory, open '${path.join(base, "foo")}'`);
        expect(() => mock.getRealFs().readFileSync(originalFile, { encoding: "utf8"})).toThrowError(`ENOENT: no such file or directory, open '${originalFile}'`);
        expect(() => mock.getRealFs().readFileSync(path.join(base, "foo2"), { encoding: "utf8"})).toThrowError(`ENOENT: no such file or directory, open '${path.join(base, "foo2")}'`);
    });
    expect(() => mock.getRealFs().readFileSync(originalFile, { encoding: "utf8"})).toThrowError(`ENOENT: no such file or directory, open '${originalFile}'`);
    expect(() => mock.getRealFs().readFileSync(path.join(base, "foo"), { encoding: "utf8"})).toThrowError(`ENOENT: no such file or directory, open '${path.join(base, "foo")}'`);
    expect(() => mock.getRealFs().readFileSync(path.join(base, "foo2"), { encoding: "utf8"})).toThrowError(`ENOENT: no such file or directory, open '${path.join(base, "foo2")}'`);
});


test("Verify opendirImpl", async () => {
    await mock.withAsync(async () => {
        const base = mock.populate({ "foo3": "bar", "foo4": "bar" });

        const rv: Dirent[] = [];
        for await (const d of await fs.promises.opendir(base)) rv.push(d);

        expect(rv.length).toEqual(2);
        rv.sort((a,b) => a.name.localeCompare(b.name));
        expect(rv[0].name).toEqual("foo3");
        expect(rv[1].name).toEqual("foo4");

    });
});
