<script lang="ts" setup>
import type { FormInst } from 'naive-ui'
import type { Prompt } from '../types'
import { usePromptStore } from '@/store/prompt'
import { createPrompt, updatePrompt } from '@/views/chat/api'
import { EditOutlined } from '@vicons/antd'
import { ChevronBackOutline, Close } from '@vicons/ionicons5'

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
			<div class="w-full px-4 py-2 mb-2 text-base font-bold border-b">
				<n-button text @click="handleBack">
					<n-icon>
						<ChevronBackOutline />
					</n-icon>
					{{ $t('chat.createPrompt') }}
				</n-button>
			</div>
			<div class="px-4">
				<n-form ref="promptFormRef" label-width="auto" :model="promptFormData" :rules="promptRules">
					<n-form-item path="title" :label="$t('common.title')">
						<n-input
							v-model:value="promptFormData.title"
							:placeholder="$t('common.inputPlaceholder')"
						/>
					</n-form-item>
					<n-form-item path="content" :label="$t('common.content')">
						<n-input
							v-model:value="promptFormData.content"
							type="textarea"
							:placeholder="$t('common.inputPlaceholder')"
						/>
					</n-form-item>
					<n-form-item>
						<n-button type="primary" class="w-full px-2 py-2 border rounded-2" @click="handleSave">
							{{ $t('common.save') }}
						</n-button>
					</n-form-item>
				</n-form>
			</div>
		</template>
		<template v-else>
			<div class="w-full px-4 py-2 mb-2 text-base font-bold border-b border-gray-300">
				{{ $t('chat.prompt') }}
			</div>

			<n-scrollbar class="h-600px">
				<div
					v-for="(item, index) of promptList"
					:key="index"
					class="mb-10px flex justify-between rounded-lg cursor-pointer border border-gray-200"
				>
					<div class="w-85% overflow-hidden" @click="handleSelect(item)">
						<span class="prompt-tag px-2 py-1 block"> {{ item.title }}： </span>
						<p class="ellipsis px-10px py-4px">
							{{ item.content }}
						</p>
					</div>
					<div class="hidden items-center cursor-pointer group-hover:flex">
						<n-button text @click="handleEdit(item, $event)">
							<template #icon>
								<n-icon size="16">
									<EditOutlined />
								</n-icon>
							</template>
						</n-button>

						<n-popconfirm
							placement="top"
							@positive-click="handleDelete(item.promptId as string, $event)"
						>
							<template #trigger>
								<n-button text>
									<template #icon>
										<n-icon size="16">
											<Close />
										</n-icon>
									</template>
								</n-button>
							</template>
							{{ $t('chat.removeConfirm') }}
						</n-popconfirm>
					</div>
				</div>
			</n-scrollbar>

			<div class="py-4 mt-2 border-t border-gray-300">
				<n-button class="w-full py-2 border rounded-2" type="primary" @click="handleAdd">
					{{ $t('chat.createPrompt') }}
				</n-button>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped></style>
