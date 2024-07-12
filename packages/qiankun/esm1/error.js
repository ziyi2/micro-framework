export class QiankunError extends Error {
    constructor(message) {
        super(`[qiankun]: ${message}`);
    }
}
