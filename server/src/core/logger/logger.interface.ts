export interface LoggerOptions {
  // 是否输出JSON格式
  json?: boolean;

  // 日志级别
  logLevel?: ('log' | 'debug' | 'error' | 'verbose' | 'warn')[];

  // 文件输出配置
  file?: {
    enabled: boolean;
    path: string;
    maxFiles?: string;
    maxSize?: string;
  };

  // 请求日志配置
  requestLogging?: {
    enabled: boolean;
    headers?: boolean;
    ignorePaths?: string[];
  };
}
