<script lang="ts" setup>
import avatar from '@/assets/images/avatar.jpg'
import aiAvatar from '@/assets/images/ai_avatar.png'

interface Props {
	visible: boolean
	type: string
}

const props = withDefaults(defineProps<Props>(), {
	visible: true,
	type: 'user',
})

const avatarImg = computed(() => {
	return props.type === 'assistant' ? aiAvatar : avatar
})
</script>

<template>
	<n-avatar class="rounded-50" v-show="props.visible" :src="avatarImg" />
</template>
