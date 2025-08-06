import isTauriEnvironment from './tauriEnvCheck'

async function getFetch(): Promise<typeof fetch> {
    if (isTauriEnvironment()) {
        try {
            const { fetch: tauriFetch } = await import(
                '@tauri-apps/plugin-http'
            )
            return tauriFetch
        } catch (error) {
            console.warn(
                'Failed to load Tauri HTTP plugin, falling back to native fetch:',
                error
            )
            return globalThis.fetch
        }
    } else {
        return globalThis.fetch
    }
}

export async function fetch(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    const fetchImpl = await getFetch()
    return fetchImpl(input, init)
}

export default fetch
