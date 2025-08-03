import { warn, debug, trace, info, error } from '@tauri-apps/plugin-log'
import isTauriEnvironment from './tauriEnvCheck'
import { getError } from '@/api/error'

function forwardConsole(
    fnName: 'log' | 'debug' | 'info' | 'warn' | 'error',
    logger: (message: string) => Promise<void>
) {
    const original = console[fnName]
    console[fnName] = (message) => {
        if (fnName === 'error') {
            message = getError(message)
        }
        if (typeof message !== 'string') {
            message = JSON.stringify(message)
        }
        if (import.meta.env.DEV) {
            original(message)
        }
        if (isTauriEnvironment()) {
            logger(message)
        }
    }
}

export const useForwardConsoleLog = () => {
    forwardConsole('log', trace)
    forwardConsole('debug', debug)
    forwardConsole('info', info)
    forwardConsole('warn', warn)
    forwardConsole('error', error)
}
