<script setup lang="ts">
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui'

// 挂载naive组件的方法至window, 以便在路由钩子函数和请求函数里面调用
function registerNaiveTools() {
	window.$loadingBar = useLoadingBar()
	window.$dialog = useDialog()
	window.$message = useMessage()
	window.$notification = useNotification()
}

const NaiveProviderContent = defineComponent({
	name: 'NaiveProviderContent',
	setup() {
		registerNaiveTools()
	},
	render() {
		return h('div')
	}
})
</script>

<template>
	<n-loading-bar-provider>
		<n-dialog-provider>
			<n-notification-provider>
				<n-message-provider>
					<slot />
					<NaiveProviderContent />
				</n-message-provider>
			</n-notification-provider>
		</n-dialog-provider>
	</n-loading-bar-provider>
</template>

<style scoped></style>
