/**
 * Simple Logger Utility
 * Centralizes logging to allow for easy replacement with a real logging service (Datadog, Sentry, etc.)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private formatMessage(level: LogLevel, message: string, meta?: any) {
        const timestamp = new Date().toISOString();
        const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        return meta ? `${base} ${JSON.stringify(meta)}` : base;
    }

    info(message: string, meta?: any) {
        console.log(this.formatMessage('info', message, meta));
    }

    warn(message: string, meta?: any) {
        console.warn(this.formatMessage('warn', message, meta));
    }

    error(message: string, meta?: any) {
        console.error(this.formatMessage('error', message, meta));
    }

    debug(message: string, meta?: any) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.formatMessage('debug', message, meta));
        }
    }
}

export const logger = new Logger();
