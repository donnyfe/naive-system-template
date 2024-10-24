<script setup lang="ts">
import avatar from '@/assets/images/avatar.jpg'
import { useAuthStore } from '@/store'
import IconLogout from '~icons/icon-park-outline/logout'
import IconSetting from '~icons/icon-park-outline/setting'
import IconUser from '~icons/icon-park-outline/user'

const { t } = useI18n()

const { userInfo, logout } = useAuthStore()
const router = useRouter()

const menus = computed(() => {
	return [
		{
			label: t('app.userCenter'),
			key: 'userCenter',
			icon: () => h(IconUser)
		},
		{
			type: 'divider',
			key: 'd1'
		},
		{
			label: t('app.systemInfo'),
			key: 'system',
			icon: () => h(IconSetting)
		},
		{
			type: 'divider',
			key: 'd1'
		},
		{
			label: t('app.loginOut'),
			key: 'loginOut',
			icon: () => h(IconLogout)
		}
	]
})

function handleSelect(key: string | number) {
	if (key === 'system') {
		router.push({ path: '/about' })
	}
	else if (key === 'userCenter') {
		router.push({ path: '/user-center' })
	}
	else if (key === 'loginOut') {
		window.$dialog?.info({
			title: t('app.loginOutTitle'),
			content: t('app.loginOutContent'),
			positiveText: t('common.confirm'),
			negativeText: t('common.cancel'),
			onPositiveClick: () => {
				logout()
			}
		})
	}
}
</script>

<template>
	<n-dropdown trigger="click" :options="menus" @select="handleSelect">
		<n-avatar round :src="userInfo?.avatar || avatar">
			<template #fallback>
				<div class="wh-full flex-center">
					<icon-park-outline-user />
				</div>
			</template>
		</n-avatar>
	</n-dropdown>
</template>

<style scoped></style>
