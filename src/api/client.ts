import fetch from '@/utils/fetchWrapper'
import { HttpClient, Api } from './schema/api'

const myHttpClient = new HttpClient({
    securityWorker: (token) => ({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }),
    customFetch: fetch,
    baseUrl: '', // Will be set after auth store initialization
})

const client = new Api(myHttpClient)

export function updateClientConfig(serverUrl: string, accessToken: string) {
    myHttpClient.baseUrl = serverUrl
    client.http.setSecurityData(accessToken)
}

export default client
