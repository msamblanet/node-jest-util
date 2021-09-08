//
// Mock node's fs with a union filesystem before we get anywhere
//
import AbstractMock from "./AbstractMock";
import { IUnionFs, Union } from "unionfs";
import { DirectoryJSON, Volume } from "memfs";
import { OpenDirOptions, Dir, PathLike } from "fs";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

export interface Mocker {
    requireActual: <X>(moduleName: string) => X
    mock: (moduleName: string, factory?: () => unknown, opts?: { virtual?: boolean | undefined }) => unknown;
}

//
// memfs does not implement opendir - here is a hacky minimal implementation
// here is a hacky minimal implementation that we can monkeypatch in
//
const opendirImpl = (fs: any) => async (path: PathLike, options?: OpenDirOptions) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return {
        [Symbol.asyncIterator]() {
            interface itr {
                index: number,
                files: Dir[],
                next: () => Promise<{ done: boolean, value?: Dir }>
            }
            return {
                index: -1,
                files: [],
                async next() {
                    if (this.index === -1) {
                        this.index = 0;
                        this.files = await fs.promises.readdir(path, { encoding: options?.encoding, withFileTypes: true });
                    }
                    if (this.index < this.files.length) return { done: false, value: this.files[this.index++] };
                    return { done: true };
                }
            } as itr;
        }
    }
}

export class MockFs extends AbstractMock {
    protected isMocked = false;
    protected readonly unionFs: IUnionFs;

    public constructor(jest: Mocker) {
        super();

        this.unionFs = new Union();
        this.unionFs.use(fs)

        jest.mock("fs", () => { return this.unionFs; });
    }

    public getRealFs(): typeof fs { return fs; }

    public populate(json: DirectoryJSON, cwd: string = path.join("/", randomUUID())): string {
        const vol = Volume.fromJSON(json, cwd);
        (vol.promises as any).opendir ??= opendirImpl(vol); // eslint-disable-line @typescript-eslint/no-explicit-any
        this.unionFs.use(vol as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        return cwd;
    }

    public mock(): void { } // eslint-disable-line @typescript-eslint/no-empty-function

    public reset(): void {
        // fss is unionfs' list of overlays
        (this.unionFs as any).fss = [fs]; // eslint-disable-line @typescript-eslint/no-explicit-any
    }
}
export default MockFs;
