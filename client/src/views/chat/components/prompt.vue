<script
	lang="ts"
	setup
>
import type { FormInst } from 'naive-ui'
import type { Prompt } from '../types'
import { usePromptStore } from '@/store/prompt'
import { createPrompt, updatePrompt } from '@/views/chat/api'
import { EditOutlined } from '@vicons/antd'
import { ChevronBackOutline, Close, ChatbubbleEllipsesOutline } from '@vicons/ionicons5'

const emit = defineEmits(['selectPrompt'])

const message = useMessage()
const promptFormRef = ref<FormInst | null>(null)
const isAdd = ref(false)

const promptStore = usePromptStore()
const promptList = computed(() => {
	return promptStore.promptList
})

const promptRules = {
	title: { required: true, message: '标题必填', trigger: 'blur' },
	content: { required: true, message: '内容必填', trigger: 'blur' }
}

// 新增/修改数据初始化
const formData = {
	promptId: '',
	title: '',
	content: ''
}

const promptFormData = ref(formData)

onMounted(async () => {
	await promptStore.getPromptList()
})

function handleAdd() {
	promptFormData.value = { ...formData }
	isAdd.value = !isAdd.value
}

function handleBack() {
	isAdd.value = false
}

function handleSelect(prompt: Prompt) {
	emit('selectPrompt', prompt)
}

function handleSave(e: MouseEvent) {
	e.preventDefault()
	const messageReactive = message.loading('处理中', {
		duration: 0
	})

	promptFormRef.value?.validate(async (errors) => {
		if (errors) {
			return message.error('验证不通过')
		}

		promptFormData.value.promptId
			? await updatePrompt({ ...promptFormData.value })
			: await createPrompt({ ...promptFormData.value, promptId: undefined })

		isAdd.value = false
		await promptStore.getPromptList()

		messageReactive.destroy()
	})
}

function handleEdit(item: Prompt, event?: MouseEvent) {
	event?.stopPropagation()
	promptFormData.value = {
		promptId: item.promptId as string,
		title: item.title,
		content: item.content
	}
	isAdd.value = true
}

function handleDelete(promptId: string, event?: MouseEvent) {
	event?.stopPropagation()
	promptStore.removePrompt(promptId)
}
</script>

<template>
<div class="flex flex-col h-full gap-2">
	<template v-if="isAdd">
		<div class="w-full px-4 py-2 mb-2 border-b border-[#eee] transition-all">
			<n-button
				text
				@click="handleBack"
				class="flex items-center gap-1 text-gray-700 hover:text-primary"
			>
				<n-icon>
					<ChevronBackOutline />
				</n-icon>
				{{ $t('chat.createPrompt') }}
			</n-button>
		</div>
		<div class="px-4">
			<n-form
				ref="promptFormRef"
				label-width="auto"
				:model="promptFormData"
				:rules="promptRules"
				class="animate-fade-in"
			>
				<n-form-item
					path="title"
					:label="$t('common.title')"
				>
					<n-input
						v-model:value="promptFormData.title"
						:placeholder="$t('common.inputPlaceholder')"
						class="rounded-lg shadow-sm"
					/>
				</n-form-item>
				<n-form-item
					path="content"
					:label="$t('common.content')"
				>
					<n-input
						v-model:value="promptFormData.content"
						type="textarea"
						:placeholder="$t('common.inputPlaceholder')"
						class="rounded-lg shadow-sm"
					/>
				</n-form-item>
				<n-form-item>
					<n-button
						type="primary"
						class="w-full px-4 py-2 rounded-lg transition-all hover:opacity-90"
						@click="handleSave"
					>
						{{ $t('common.save') }}
					</n-button>
				</n-form-item>
			</n-form>
		</div>
	</template>
	<template v-else>
		<div class="w-full px-4 py-3 border-b border-[#eee] flex justify-between items-center">
			<span class="text-base font-medium text-gray-800">{{ $t('chat.prompt') }}</span>

			<n-button
				type="primary"
				size="small"
				class="px-6 rounded-lg transition-colors hover:opacity-90"
				@click="handleAdd"
			>
				{{ $t('chat.createPrompt') }}
			</n-button>
		</div>

		<n-scrollbar class="h-[calc(100%-120px)] px-4">
			<template v-if="!promptList.length">
				<div class="flex flex-col items-center justify-center h-[calc(100vh-280px)]">
					<n-empty
						class="animate-fade-in"
						:description="$t('chat.noPrompts')"
					>
						<template #icon>
							<div class="text-5xl text-gray-300 mb-2">
								<n-icon>
									<ChatbubbleEllipsesOutline />
								</n-icon>
							</div>
						</template>
					</n-empty>
				</div>
			</template>

			<div
				v-else
				class="space-y-3 py-2"
			>
				<div
					v-for="(item, index) of promptList"
					:key="index"
					class="group relative bg-white dark:bg-dark-800 rounded-lg border border-gray-100 dark:border-dark-700 hover:border-primary transition-all duration-300 cursor-pointer"
				>
					<div
						class="w-full p-3"
						@click="handleSelect(item)"
					>
						<div class="text-sm font-medium dark:text-gray-200 text-gray-800 mb-1">{{ item.title }}</div>
						<p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{{ item.content }}</p>
					</div>

					<div
						class="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
					>
						<n-button
							text
							size="small"
							@click="handleEdit(item, $event)"
						>
							<template #icon>
								<n-icon class="text-gray-600 hover:text-primary">
									<EditOutlined />
								</n-icon>
							</template>
						</n-button>

						<n-popconfirm
							placement="top"
							@positive-click="handleDelete(item.promptId as string, $event)"
						>
							<template #trigger>
								<n-button
									text
									size="small"
								>
									<template #icon>
										<n-icon class="text-gray-600 hover:text-red-500">
											<Close />
										</n-icon>
									</template>
								</n-button>
							</template>
							{{ $t('chat.removeConfirm') }}
						</n-popconfirm>
					</div>
				</div>
			</div>
		</n-scrollbar>

		<div
			v-if="promptList.length"
			class="px-4 py-3 border-t border-[#eee] mt-auto"
		>
			<n-button
				type="primary"
				class="w-full py-2 rounded-lg transition-colors hover:opacity-90"
				@click="handleAdd"
			>
				{{ $t('chat.createPrompt') }}
			</n-button>
		</div>
	</template>
</div>
</template>

<style scoped>
	.animate-fade-in {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
