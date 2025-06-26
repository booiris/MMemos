import { warn, debug, trace, info, error } from '@tauri-apps/plugin-log';
import isTauriEnvironment from './tauriEnvCheck';

function forwardConsole(
    fnName: 'log' | 'debug' | 'info' | 'warn' | 'error',
    logger: (message: string) => Promise<void>
) {
    if (!isTauriEnvironment()) {
        return;
    }

    const original = console[fnName];
    console[fnName] = (message) => {
        original(message);
        logger(message);
    };
}

export const useForwardConsoleLog = () => {
    forwardConsole('log', trace);
    forwardConsole('debug', debug);
    forwardConsole('info', info);
    forwardConsole('warn', warn);
    forwardConsole('error', error);
}