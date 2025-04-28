import * as Joi from 'joi'

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  PORT: Joi.number().default(3000),

  // 数据库配置
  DATABASE_TYPE: Joi.string().valid('mysql', 'mongodb', 'postgres').default('mysql'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required().default(3306), // 注意：这里的默认值应该是一个数字，而不是一个字符串。如果使用字符串，Joi会将其视为一个字符串而不是一个数字。因此，你需要将默认值设置为一个数字，例如3306。
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNC: Joi.boolean().default(false),
  DATABASE_LOGGING: Joi.boolean().default(false),
  DATABASE_POOL_SIZE: Joi.number().default(10),

  // Redis配置
  REDIS_URL: Joi.string().required(),
  REDIS_DB: Joi.number().default(0),
  REDIS_PREFIX: Joi.string().default('nest:'),
  REDIS_TTL: Joi.number().default(86400),
  // Redis会话相关
  REDIS_SESSION_PREFIX: Joi.string().default('sess:'),
  REDIS_SESSION_TTL: Joi.number().default(86400),

  // JWT配置
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // API配置
  API_PREFIX: Joi.string().default('api'),
  API_VERSION: Joi.string().default('v1'),

  // 日志配置
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  LOG_FILE_PATH: Joi.string().default('logs/app.log'),
  LOG_MAX_FILES: Joi.number().default(30),
  LOG_MAX_SIZE: Joi.string().default('20m'),

  // 安全相关补充
  ALLOWED_ORIGINS: Joi.string().default('*'),
  RATE_LIMIT_WINDOW: Joi.number().default(900000), // 15分钟
  RATE_LIMIT_MAX: Joi.number().default(100),
  CSRF_SECRET: Joi.string().required(),
  SESSION_SECRET: Joi.string().required(),
  COOKIE_DOMAIN: Joi.string().optional(),
  COOKIE_SECURE: Joi.boolean().default(false),

  // 文件上传相关
  UPLOAD_DEST: Joi.string().default('./uploads'),
  UPLOAD_MAX_SIZE: Joi.number().default(5242880),
  UPLOAD_MAX_FILES: Joi.number().default(10),
  UPLOAD_ALLOWED_TYPES: Joi.string().default('image/*,application/pdf'),

  // HTTP相关
  HTTP_TIMEOUT: Joi.number().default(5000),
  HTTP_MAX_REDIRECTS: Joi.number().default(5),
  HTTP_RETRIES: Joi.number().default(3),
  HTTP_RETRY_DELAY: Joi.number().default(1000),
  HTTP_MAX_CONCURRENT: Joi.number().default(10),

  // 百度配置
  QIANFAN_API_KEY: Joi.string().required(),
  QIANFAN_API_SECRET: Joi.string().required(),
})
