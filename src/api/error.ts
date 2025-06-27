import { GooglerpcStatus } from "./schema/api";

export function getError(error: unknown) {
    if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
            return 'Connection timeout';
        }
        return error.name + ': ' + error.message;
    } else if (typeof error === 'string') {
        return error;
    } else if (error && typeof error === 'object' && 'error' in error) {
        const err = error.error as GooglerpcStatus;
        var res = err.message || '';
        if (err.details) {
            res += '\n' + err.details.map(d => JSON.stringify(d)).join('\n');
        }
        return res;
    } else {
        return JSON.stringify(error);
    }
}