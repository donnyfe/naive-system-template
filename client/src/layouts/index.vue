<script setup lang="ts">
import leftMenu from './left-menu.vue'
import topMenu from './top-menu.vue'
import mixMenu from './mix-menu.vue'
import { SettingDrawer } from './components'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const layoutMap = {
	leftMenu,
	topMenu,
	mixMenu,
}
</script>

<template>
	<SettingDrawer />
	<component :is="layoutMap[appStore.layoutMode]" />
</template>
