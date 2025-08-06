import fetch from '@/utils/fetchWrapper'
import { HttpClient, Api } from './schema/api'

const myHttpClient = new HttpClient({
    securityWorker: (token) => ({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }),
    customFetch: fetch,
    baseUrl: localStorage.getItem('serverUrl') || '',
})

const client = new Api(myHttpClient)

client.http.setSecurityData(localStorage.getItem('accessToken') || '')

export default client

export function getHost() {
    return client.http.baseUrl
}

export function getAuthToken() {
    return localStorage.getItem('accessToken')
}
