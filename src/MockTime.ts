import AbstractMock from "./AbstractMock";

export class MockTime extends AbstractMock {

    public originalNow?: ()=>number
    public nextNowValue = 0;
    public nowIncrement = 1;

    protected now = (): number => {
        const rv = this.nextNowValue;
        this.nextNowValue += this.nowIncrement;
        return rv;
    }

    public mock(): void {
        if (this.originalNow) throw new Error("Already mocked");
        this.originalNow = Date.now;
        Date.now = this.now;
        this.nextNowValue = 0;
        this.nowIncrement = 1;
    }

    public reset(): void {
        if (!this.originalNow) throw new Error("Not mocked");
        Date.now = this.originalNow;
        this.originalNow = undefined;
    }
}
export default MockTime;
