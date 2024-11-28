import { registerAs } from '@nestjs/config'

export const databaseConfig = registerAs('database', () => ({
  type: process.env.DATABASE_TYPE || 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNC === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',
  poolSize: parseInt(process.env.DATABASE_POOL_SIZE, 10) || 10,
}))

export const redisConfig = registerAs('redis', () => ({
  url: process.env.REDIS_URL,
  db: parseInt(process.env.REDIS_DB, 10) || 0,
  prefix: process.env.REDIS_PREFIX || 'sess:',
  ttl: parseInt(process.env.REDIS_TTL, 10) || 86400,
}))

export const httpConfig = registerAs('http', () => ({
  host: process.env.HTTP_HOST || '0.0.0.0',
  port: parseInt(process.env.HTTP_PORT, 10) || 3000,
  timeout: parseInt(process.env.HTTP_TIMEOUT, 10) || 5000,
  maxRedirects: parseInt(process.env.HTTP_MAX_REDIRECTS, 10) || 5,
  retries: parseInt(process.env.HTTP_RETRIES, 10) || 3,
  retryDelay: parseInt(process.env.HTTP_RETRY_DELAY, 10) || 1000,
  maxConcurrent: parseInt(process.env.HTTP_MAX_CONCURRENT, 10) || 10,
}))

export const securityConfig = registerAs('security', () => ({
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  csrf: {
    secret: process.env.CSRF_SECRET,
  },
  session: {
    name: process.env.SESSION_NAME || 'sess',
    secret: process.env.SESSION_SECRET || 'sess',
  },
  cookie: {
    // 从X-Forwarded-Host获取实际域名
    domain: process.env.COOKIE_DOMAIN || undefined,
    secure: process.env.COOKIE_SECURE === 'true',
  },
}))

export default registerAs('logger', () => ({
  json: true,
  logLevel: process.env.LOG_LEVEL || ['log', 'error', 'warn', 'debug'],
  file: {
    enabled: true,
    path: process.env.LOG_FILE_PATH || 'logs/app.log',
    maxFiles: parseInt(process.env.LOG_MAX_FILES, 10) || 30,
    maxSize: process.env.LOG_MAX_SIZE || '20m',
  },
  requestLogging: {
    enabled: true,
    path: process.env.REQUEST_LOG_FILE_PATH || 'logs/request.log',
    headers: true,
    ignorePaths: ['/health'],
  },
}))

export const uploadConfig = registerAs('upload', () => ({
  dest: process.env.UPLOAD_DEST || './uploads',
  domain: process.env.UPLOAD_DOMAIN || 'http://127.0.0.1',
  serveRoot: process.env.UPLOAD_SERVE_ROOT || '/static',
  maxSize: parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 5242880,
  maxFiles: parseInt(process.env.UPLOAD_MAX_FILES, 10) || 10,
  allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || ['image/*', 'video/*', 'application/pdf'],
}))

export const emailConfig = registerAs('email', () => ({
  transport: process.env.EMAIL_TRANSPORT,
  from: process.env.EMAIL_FROM,
}))


export const baiduConfig = registerAs('baidu', () => ({
  qianfanApiKey: process.env.QIANFAN_API_KEY,
  qianfanApiSecret: process.env.QIANFAN_API_SECRET
}))

export const initialConfig = registerAs('initial', () => ({
  avatar: process.env.INITIAL_AVATAR || '',
  password: process.env.INITIAL_PASSWORD || 'Aa12345678',
}))
