<script setup lang="ts">
import ChatContent from './components/content.vue'
import ChatSidebar from './components/sidebar.vue'
</script>

<template>
	<div class="h-full flex rounded-md border border-gray-200">
		<ChatSidebar />
		<div class="flex-1">
			<ChatContent />
		</div>
	</div>
</template>

<style scoped></style>
