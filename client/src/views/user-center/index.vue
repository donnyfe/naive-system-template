<script setup lang="ts">
import { useAuthStore } from '@/store'

const authStore = useAuthStore()
const { userInfo } = authStore
</script>

<template>
	<n-space vertical>
		<n-card title="个人信息">
			<n-space size="large">
				<n-avatar round :size="128" :src="userInfo.avatar" />
				<n-descriptions label-placement="left" class="w-600px" :column="2" :title="`欢迎您，${userInfo.username}!`">
					<n-descriptions-item label="编号">
						{{ userInfo.id }}
					</n-descriptions-item>
					<n-descriptions-item label="用户名">
						{{ userInfo.username }}
					</n-descriptions-item>
					<n-descriptions-item label="手机号">
						{{ userInfo.phone }}
					</n-descriptions-item>
					<n-descriptions-item label="邮箱">
						{{ userInfo.email }}
					</n-descriptions-item>
				</n-descriptions>
			</n-space>
		</n-card>
	</n-space>
</template>

<style scoped></style>
