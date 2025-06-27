import fetch from '@/lib/fetchWrapper';
import { HttpClient, Api } from './schema/api';

const myHttpClient = new HttpClient({
    securityWorker: (token) => ({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }),
    customFetch: fetch,
    baseUrl: localStorage.getItem('serverUrl') || '',
});

const client = new Api(myHttpClient);

client.http.setSecurityData(localStorage.getItem('accessToken') || '')

export default client;