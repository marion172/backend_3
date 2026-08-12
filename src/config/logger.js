import path from 'path';
import { fileURLToPath } from 'url';
import winston from "winston";
import { envConfig } from './index.js';
import dailyRotateFile from 'winston-daily-rotate-file';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, '../../logs');

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red bold',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
}

winston.addColors(customLevels.colors);

const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(({ timestamp, level, message, stack }) =>
        `${timestamp} [${level}]: ${stack ?? message}`)
);

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.json()
);

const logger = winston.createLogger({
    level: envConfig.NODE_ENV === 'development' ? 'debug' : 'info',
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({ format: consoleFormat, }),
        new dailyRotateFile({
            dirname: logDir,
            filename: 'error_%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            format: fileFormat,
            maxFiles: '14d'
        }),
        new dailyRotateFile({
            dirname: logDir,
            filename: 'combined_%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            format: fileFormat,
            maxFiles: '14d'
        })
    ],
})

export default logger;