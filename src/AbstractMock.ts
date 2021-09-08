export abstract class AbstractMock {

    public abstract mock(): void;
    public abstract reset(): void;

    public with<X>(action: () => X): X {
        this.mock();
        try {
            return action();
        } finally {
            this.reset();
        }
    }

    public async withAsync<X>(action: () => Promise<X>): Promise<X> {
        this.mock();
        try {
            return await action();
        } finally {
            this.reset();
        }
    }
}
export default AbstractMock;
