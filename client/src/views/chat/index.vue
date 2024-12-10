<script setup lang="ts">
import ChatContent from './components/content.vue'
import ChatSidebar from './components/sidebar.vue'
</script>

<template>
	<div class="relative h-full flex rounded-md border border-gray-200 dark:border-dark-700">
		<ChatSidebar />
		<div class="flex-1 w-full">
			<ChatContent />
		</div>
	</div>
</template>

<style scoped></style>
