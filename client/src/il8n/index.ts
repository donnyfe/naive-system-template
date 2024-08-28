import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import enUS from './locales/en_US.json'
import zhCN from './locales/zh_CN.json'
import { local } from '@/utils'

export const i18n = createI18n({
  legacy: false,
  locale: local.get('lang') || 'enUS', // 默认显示语言
  fallbackLocale: 'enUS',
  messages: {
    zhCN,
    enUS,
  },
})

export function setupI18n(app: App) {
  app.use(i18n)
}
