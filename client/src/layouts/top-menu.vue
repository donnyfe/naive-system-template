<script lang="ts" setup>
import { useAppStore, useRouteStore } from '@/store'
import {
	BackTop,
	FullScreen,
	Logo,
	Menu,
	Notices,
	Search,
	Setting,
	TabBar,
	UserCenter
} from './components'

const routeStore = useRouteStore()
const appStore = useAppStore()
</script>

<template>
	<n-layout class="wh-full" embedded>
		<n-layout
			class="h-full"
			content-style="display: flex;flex-direction: column;min-height:100%;"
			embedded
			:native-scrollbar="false"
		>
			<div class="flex flex-col h-100vh">
				<n-layout-header bordered>
					<div class="h-60px flex-y-center justify-between">
						<Logo v-if="appStore.showLogo" />
						<Menu mode="horizontal" responsive />
						<div class="flex-y-center gap-1 h-full p-x-xl">
							<Search />
							<Notices />
							<FullScreen />
							<DarkModeSwitch />
							<LangsSwitch />
							<Setting />
							<UserCenter />
						</div>
					</div>
					<!-- 页签栏 -->
					<TabBar v-if="appStore.showTabs" ref="tabRef" class="h-45px" />
				</n-layout-header>

				<div class="grow-1 overflow-hidden p-16px bg-white dark:bg-dark">
					<div class="overflow-auto h-full">
						<router-view v-slot="{ Component, route }" class="flex-1">
							<transition :name="appStore.transitionAnimation" mode="out-in">
								<keep-alive :include="routeStore.cacheRoutes">
									<component :is="Component" v-if="appStore.loadFlag" :key="route.fullPath" />
								</keep-alive>
							</transition>
						</router-view>
					</div>
				</div>

				<n-layout-footer v-if="appStore.showFooter" class="h-40px flex-center" bordered>
					{{ appStore.footerText }}
				</n-layout-footer>
			</div>
			<BackTop />
		</n-layout>
	</n-layout>
</template>
