<script setup lang="ts">
import ChatContent from './components/content.vue'
import ChatSidebar from './components/sidebar.vue'
import ChatPrompt from './components/prompt.vue'
</script>

<template>
	<div class="h-full flex relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
		<ChatSidebar />
		<ChatContent />
		<ChatPrompt />
	</div>
</template>

<style lang="scss" scoped>
	.chat {
		& > :deep(.n-card__content) {
			padding: 0;
		}
	}
</style>
