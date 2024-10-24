<script lang="ts" setup>
import aiAvatar from '@/assets/images/ai_avatar.png'
import avatar from '@/assets/images/avatar.jpg'

interface Props {
	visible: boolean
	type: string
}

const props = withDefaults(defineProps<Props>(), {
	visible: true,
	type: 'user'
})

const avatarImg = computed(() => {
	return props.type === 'assistant' ? aiAvatar : avatar
})
</script>

<template>
	<n-avatar v-show="props.visible" class="rounded-50" :src="avatarImg" />
</template>
