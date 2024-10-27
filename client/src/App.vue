<script setup lang="ts">
import { naiveI18nOptions } from '@/il8n'
import { darkTheme } from 'naive-ui'
import { useAppStore } from './store'

const appStore = useAppStore()

appStore.setAppLang(appStore.lang)

const naiveLocale = computed(() => {
	const lang = naiveI18nOptions[appStore.lang]
	return lang || naiveI18nOptions.enUS
})
</script>

<template>
	<n-config-provider
		class="wh-full" inline-theme-disabled :theme="appStore.colorMode === 'dark' ? darkTheme : null"
		:locale="naiveLocale.locale" :date-locale="naiveLocale.dateLocale" :theme-overrides="appStore.theme"
	>
		<naive-provider>
			<router-view />
			<Watermark :show-watermark="appStore.showWatermark" />
		</naive-provider>
	</n-config-provider>
</template>
