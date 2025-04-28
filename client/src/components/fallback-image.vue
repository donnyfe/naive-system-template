<script
	setup
	lang="ts"
>
import { ref } from 'vue'

defineProps<{
	src: string
	alt?: string
	class?: string | string[]
}>()

const isError = ref(false)
const isLoading = ref(true)

function handleLoad() {
	isLoading.value = false
}

function handleError() {
	isError.value = true
	isLoading.value = false
}
</script>

<template>
<div class="relative overflow-hidden">
	<n-spin
		v-if="isLoading"
		size="small"
	/>

	<template v-if="!isError">
		<img
			:src="src"
			:alt="alt"
			@load="handleLoad"
			@error="handleError"
			class="w-full h-full block"
		/>
	</template>

	<template v-else>
		<div class="w-full h-full flex-row flex-center bg-#f0f0f0 select-none">
			<icon-park-outline-error-picture class="text-20px mr-2 text-dark" />
			<n-text class="text-12px mt-4px text-dark">
				加载失败
			</n-text>
		</div>
	</template>
</div>
</template>
