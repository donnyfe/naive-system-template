export enum ScheduleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  RUNNING = 'running',
  ERROR = 'error',
}

export enum ScheduleType {
  CRON = 'cron',
  INTERVAL = 'interval',
  TIMEOUT = 'timeout',
}
