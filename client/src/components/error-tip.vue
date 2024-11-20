<script setup lang="ts">

enum ErrorType {
	Forbidden = '403',
	NotFound = '404',
	ServerError = '500'
}

interface ErrorTipProps {
	type: string
	message?: string
}

defineProps<ErrorTipProps>()

const router = useRouter()
</script>

<template>
	<div class="flex-col-center h-full">
		<img
			v-if="type === ErrorType.Forbidden"
			src="@/assets/svg/error-403.svg"
			alt=""
			class="w-1/3"
		/>
		<img
			v-if="type === ErrorType.NotFound"
			src="@/assets/svg/error-404.svg"
			alt=""
			class="w-1/3"
		/>
		<img
			v-if="type === ErrorType.ServerError"
			src="@/assets/svg/error-500.svg"
			alt=""
			class="w-1/3"
		/>
		<n-button type="primary" @click="router.push('/')">
			{{ $t('app.backHome') }}
		</n-button>
	</div>
</template>
