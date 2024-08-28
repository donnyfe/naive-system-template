import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear' // 导入插件
import timezone from 'dayjs/plugin/timezone' // 导入插件
import utc from 'dayjs/plugin/utc' // 导入插件
import 'dayjs/locale/zh-cn' // 导入本地化语言

export * from './is'
export * from './response'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isLeapYear) // 使用插件
dayjs.locale('zh-cn') // 使用本地化语言
dayjs.tz.setDefault('Asia/Beijing')

/**
 * 获取当前时间
 * YYYY-MM-DD HH:mm:ss
 * @returns
 */
export function getNowDate() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 生成唯一id
 * UUID
 * @returns
 */
export function generateUUID(): string {
  const uuid = uuidv4()
  return uuid.replaceAll('-', '')
}
