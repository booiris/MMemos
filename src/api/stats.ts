import client from './client'
import { getError } from './error'
import { V1UserStats } from './schema/api'

// TODO: 添加 token 失效处理
export async function getUserStats(userName: string): Promise<V1UserStats> {
    try {
        const response = await client.api.userServiceGetUserStats(
            userName,
            '/stats',
            { secure: true, signal: AbortSignal.timeout(10000) }
        )
        return response
    } catch (error) {
        throw `[getUserStats] ${getError(error)}`
    }
}
