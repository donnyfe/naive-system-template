<script setup lang="ts">
import { useAppStore } from '@/store/app'
import { SettingDrawer } from './components'
import leftMenu from './left-menu.vue'
import mixMenu from './mix-menu.vue'
import topMenu from './top-menu.vue'

const appStore = useAppStore()
const layoutMap = {
	leftMenu,
	topMenu,
	mixMenu
}
</script>

<template>
	<SettingDrawer />
	<component :is="layoutMap[appStore.layoutMode]" />
</template>
