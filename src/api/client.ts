import fetch from '@/lib/fetchWrapper';
import { HttpClient, Api } from './schema/api';

const myHttpClient = new HttpClient({
    securityWorker: (token) => ({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }),
    customFetch: fetch,
});

export const client = new Api(myHttpClient);