<script lang="ts" setup>
import type { MenuInst, MenuOption } from 'naive-ui'
import { useAppStore, useRouteStore } from '@/store'
import {
	BackTop,
	CollapaseButton,
	FullScreen,
	Logo,
	Notices,
	Search,
	Setting,
	TabBar,
	UserCenter
} from './components'

const routeStore = useRouteStore()
const appStore = useAppStore()
const pageRoute = useRoute()
const router = useRouter()

const menuInstRef = ref<MenuInst | null>(null)

watch(
	() => pageRoute.path,
	() => {
		menuInstRef.value?.showOption(routeStore.activeMenu as string)
	},
	{ immediate: true }
)

const topMenu = ref<MenuOption[]>([])
const activeTopMenu = ref<string>('')

function handleTopMenu() {
	const menus = routeStore.menus as any

	topMenu.value = menus.map((i: any) => {
		const { icon, label, key } = i
		return { icon, label, key }
	})
}

onMounted(() => {
	handleTopMenu()

	// 根据当前页面获取选中菜单和对应侧边菜单
	const currentMenuKey = pageRoute.matched[1].path
	updateTopMenu(currentMenuKey)
})

const sideMenu = ref<MenuOption[]>([])
function handleSideMenu(key: string) {
	const targetMenu = routeStore.menus.find((i: any) => i.key === key)
	if (targetMenu) {
		sideMenu.value = (targetMenu.children ? targetMenu.children : [targetMenu]) as any
	}
}

function updateTopMenu(key: string) {
	handleSideMenu(key)
	activeTopMenu.value = key
	router.push(key)
}
</script>

<template>
	<n-layout has-sider class="wh-full" embedded>
		<!-- 侧边栏 -->
		<n-layout-sider
			bordered
			:collapsed="appStore.collapsed"
			collapse-mode="width"
			:collapsed-width="64"
			:width="240"
			content-style="display: flex;flex-direction: column;min-height:100%;"
		>
			<Logo v-if="appStore.showLogo" />
			<n-scrollbar class="flex-1">
				<n-menu
					ref="menuInstRef"
					:collapsed="appStore.collapsed"
					:indent="20"
					:collapsed-width="64"
					:options="sideMenu"
					:value="routeStore.activeMenu"
				/>
			</n-scrollbar>
		</n-layout-sider>

		<n-layout
			class="h-full"
			content-style="display: flex;flex-direction: column;min-height:100%;"
			embedded
			:native-scrollbar="false"
		>
			<div class="flex flex-col h-100vh">
				<n-layout-header bordered>
					<div class="h-60px flex-y-center justify-between">
						<CollapaseButton />
						<n-menu
							ref="menuInstRef"
							mode="horizontal"
							responsive
							:options="topMenu"
							:value="activeTopMenu"
							@update:value="updateTopMenu"
						/>
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
