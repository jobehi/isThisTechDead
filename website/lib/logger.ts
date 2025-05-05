/**
 * Logger utility that conditionally logs based on environment
 * Only logs in development mode, silent in production
 */

const isProd = process.env.NODE_ENV === 'production';

type LoggerFunction = (message: string, ...args: unknown[]) => void;

interface Logger {
  log: LoggerFunction;
  info: LoggerFunction;
  warn: LoggerFunction;
  error: LoggerFunction;
  debug: LoggerFunction;
}

const noopLogger: LoggerFunction = () => {};

// In production, only error logs are preserved
const logger: Logger = {
  log: isProd ? noopLogger : console.log,
  info: isProd
    ? noopLogger
    : (message: string, ...args: unknown[]) => console.log(`ℹ️ ${message}`, ...args),
  warn: isProd
    ? noopLogger
    : (message: string, ...args: unknown[]) => console.warn(`⚠️ ${message}`, ...args),
  error: (message: string, ...args: unknown[]) => console.error(`❌ ${message}`, ...args),
  debug: isProd
    ? noopLogger
    : (message: string, ...args: unknown[]) => console.log(`🔍 ${message}`, ...args),
};

export default logger;
