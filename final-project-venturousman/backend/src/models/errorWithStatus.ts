export class ErrorWithStatus extends Error {
    status?: number;
    constructor(
        message: string,
        status: number,
        name?: string,
        stack?: string,
    ) {
        super(message);
        this.status = status;
        if (name) {
            this.name = name;
        }
        if (stack) {
            this.stack = stack;
        }
    }
}
