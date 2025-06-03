import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import dotenv from 'dotenv';
dotenv.config();
const BASE_PATH = path.join(__dirname, 'src', 'db');
const client = process.env.DB_CLIENT || 'sqlite3';
let connection;
if (process.env.DB_CONNECTION_STRING) {
    connection = process.env.DB_CONNECTION_STRING;
}
else {
    switch (client) {
        case 'pg':
            const pgUser = process.env.DB_USER;
            const pgPassword = process.env.DB_PASSWORD;
            const pgDatabase = process.env.DB_NAME;
            if (pgUser === undefined || pgPassword === undefined || pgDatabase === undefined) {
                throw new Error('For PostgreSQL (pg), DB_USER, DB_PASSWORD, and DB_NAME environment variables must be set when not using DB_CONNECTION_STRING.');
            }
            const pgConnectionDetails = {
                host: process.env.DB_HOST || '127.0.0.1',
                port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
                user: pgUser,
                password: pgPassword,
                database: pgDatabase,
                ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
            };
            connection = pgConnectionDetails;
            break;
        case 'mysql':
        case 'mysql2':
            const mysqlUser = process.env.DB_USER;
            const mysqlPassword = process.env.DB_PASSWORD;
            const mysqlDatabase = process.env.DB_NAME;
            if (mysqlUser === undefined || mysqlPassword === undefined || mysqlDatabase === undefined) {
                throw new Error('For MySQL (mysql/mysql2), DB_USER, DB_PASSWORD, and DB_NAME environment variables must be set when not using DB_CONNECTION_STRING.');
            }
            const mysqlConnectionDetails = {
                host: process.env.DB_HOST || '127.0.0.1',
                port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
                user: mysqlUser,
                password: mysqlPassword,
                database: mysqlDatabase,
            };
            connection = mysqlConnectionDetails;
            break;
        case 'sqlite3':
        default:
            const sqliteConnectionDetails = {
                filename: process.env.DB_FILENAME || path.join(__dirname, 'data.db'),
            };
            connection = sqliteConnectionDetails;
            break;
    }
}
const config = {
    client: client,
    connection: connection,
    useNullAsDefault: client === 'sqlite3',
    migrations: {
        directory: path.join(BASE_PATH, 'migrations'),
        tableName: 'knex_migrations',
        extension: 'ts',
    },
    seeds: {
        directory: path.join(BASE_PATH, 'seeds'),
        extension: 'ts',
    },
    pool: client === 'sqlite3' ? {
        afterCreate: (conn, done) => {
            conn.run('PRAGMA foreign_keys = ON', done);
        },
    } : {
        min: 2,
        max: 10,
        createTimeoutMillis: 3000,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
        propagateCreateError: false,
    },
};
export default config;
//# sourceMappingURL=knexfile.js.map