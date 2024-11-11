import type { App } from 'vue'
import type { NDateLocale, NLocale } from 'naive-ui'
import type { Lang } from '@/types/global'
import { dateZhCN, zhCN as zhCNLocale } from 'naive-ui'
import { createI18n } from 'vue-i18n'
import enUS from './locales/en_US.json'
import zhCN from './locales/zh_CN.json'
import { local } from '@/utils'

const defaultLocale = 'enUS'

export const i18n = createI18n({
	legacy: false,
	locale: local?.get('lang') || defaultLocale, // 默认显示语言
	fallbackLocale: defaultLocale,
	messages: {
		zhCN,
		enUS
	}
})

export function setupI18n(app: App) {
	app.use(i18n)
}

export function setLocale(locale: Lang) {
	i18n.global.locale.value = locale
}

export const $t = i18n.global.t

export const naiveI18nOptions: Record<Lang, { locale: NLocale | null; dateLocale: NDateLocale | null }> = {
	zhCN: {
		locale: zhCNLocale,
		dateLocale: dateZhCN
	},
	enUS: {
		locale: null,
		dateLocale: null
	}
}
