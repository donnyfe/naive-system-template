<script lang="ts" setup>
import aiAvatar from '@/assets/images/ai_avatar.png'
import avatar from '@/assets/images/avatar.jpg'
import { useAuthStore } from '@/store'

interface Props {
	visible: boolean
	type: 'user' | 'assistant'
}

const props = withDefaults(defineProps<Props>(), {
	visible: true,
	type: 'user'
})

const authStore = useAuthStore()

const userAvatar = computed(() => {
	return authStore.userInfo?.avatar || avatar
})

const avatarImg = computed(() => {
	return props.type === 'assistant' ? aiAvatar : userAvatar.value
})
</script>

<template>
	<n-avatar v-show="props.visible" class="rounded-50" :src="avatarImg" />
</template>
