<script
	lang="ts"
	setup
>
import type { FormInst } from 'naive-ui'
import type { Prompt } from '../types'
import { useChatStore } from '@/store/chat'
import { createPrompt, updatePrompt } from '@/views/chat/api'
import { EditOutlined } from '@vicons/antd'
import {
	Close,
	Search,
	ChatbubbleEllipsesOutline,
} from '@vicons/ionicons5'

const emit = defineEmits(['selectPrompt'])

const message = useMessage()
const promptFormRef = ref<FormInst | null>(null)
const isAdd = ref(false)
const chatStore = useChatStore()

const filteredPromptList = computed(() => {
	return chatStore.searchPromptList.length > 0 ? chatStore.searchPromptList : chatStore.promptList
})


// 监听 promptList 变化时更新 searchPromptList
watch(() => chatStore.promptList, (newVal) => {
	chatStore.searchPromptList = newVal
}, { immediate: true })

// const activeTab = ref('all')

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

const searchInputRef = ref<HTMLElement | null>(null)
const searchText = ref('')
const isFocused = ref(false)

onMounted(async () => {
	await chatStore.getPromptList()
	chatStore.searchPromptList = chatStore.promptList
})

function handleAdd() {
	promptFormData.value = { ...formData }
	isAdd.value = !isAdd.value
}

function handleBack() {
	isAdd.value = false
}

/**
 * 选择指令
 * @param prompt 指令
 */
function handleSelect(prompt: Prompt) {
	chatStore.prompt = prompt.content
	emit('selectPrompt', prompt)
}

/**
 * 保存指令
 * @param e 事件
 */
function handleSave(e: MouseEvent) {
	e.preventDefault()
	const messageReactive = message.loading('处理中', {
		duration: 0
	})

	promptFormRef.value?.validate(async (errors) => {
		if (errors) {
			return message.error('验证不通过')
		}

		try {

			promptFormData.value.promptId
				? await updatePrompt({ ...promptFormData.value })
				: await createPrompt({ ...promptFormData.value, promptId: undefined })

			isAdd.value = false
			await chatStore.getPromptList()

			messageReactive.destroy()
		} catch(error) {
			console.error(error)
		}

	})
}

/**
 * 编辑指令
 * @param item 指令
 * @param event 事件
 */
function handleEdit(item: Prompt, event?: MouseEvent) {
	event?.stopPropagation()
	promptFormData.value = {
		promptId: item.promptId as string,
		title: item.title,
		content: item.content
	}
	isAdd.value = true
}

/**
 * 移除指令
 * @param promptId 指令ID
 * @param event 事件
 */
function handleDelete(promptId: string, event?: MouseEvent) {
	event?.stopPropagation()
	chatStore.removePrompt(promptId)
}

/**
 * 搜索指令
 */
function handleSearch() {
	chatStore.searchPrompts(searchText.value)
}

/**
 * 搜索框失去焦点
 */
function handleSearchBlur() {
	if (!searchText.value) {
		isFocused.value = false
		chatStore.searchPrompts('')
	}
}
</script>

<template>
	<div
		class="prompt-sidebar relative z-10 h-full shadow-lg overflow-hidden"
		:class="[chatStore.showPromptSidebar ? 'w-280px' : 'w-0']"
	>
		<div class="absolute top-0 left-0 w-280px h-full px-3 flex flex-col">
			<!-- 标题栏 -->
			<div class="flex-none h-16 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="text-base font-medium text-gray-800 dark:text-gray-200">{{ $t('chat.promptCenter') }}</span>
				</div>

				<div class="flex items-center gap-2">
					<n-button
						quaternary
						circle
						size="small"
						class="hover:text-error transition-colors"
						@click="chatStore.showPromptSidebar = false"
					>
						<template #icon>
							<n-icon><Close /></n-icon>
						</template>
					</n-button>
				</div>
			</div>

			<!-- 分类标签页 -->
			<!-- <n-tabs v-model:value="activeTab" class="px-2 pt-2">
				<n-tab-pane name="all" tab="全部" />
				<n-tab-pane name="custom" tab="自定义" />
				<n-tab-pane name="office" tab="办公助理" />
				<n-tab-pane name="ai" tab="AI 作画" />
			</n-tabs> -->

			<!-- 主体内容区 -->
			<template v-if="isAdd">
				<div class="flex-1 overflow-auto pt-4">
					<n-form
						ref="promptFormRef"
						label-width="auto"
						:model="promptFormData"
						:rules="promptRules"
						class="animate-fade-in"
					>
						<n-form-item path="title" :label="$t('common.title')">
							<n-input
								v-model:value="promptFormData.title"
								:placeholder="$t('chat.promptTitle')"
								class="rounded-lg shadow-sm"
							/>
						</n-form-item>
						<n-form-item path="content" :label="$t('common.content')">
							<n-input
								v-model:value="promptFormData.content"
								type="textarea"
								:placeholder="$t('chat.promptContent')"
								class="rounded-lg shadow-sm"
							/>
						</n-form-item>
					</n-form>

					<div class="flex gap-2 mt-4">
						<n-button
							class="flex-1 rounded-lg"
							@click="handleBack"
						>
							{{ $t('common.cancel') }}
						</n-button>
						<n-button
							type="primary"
							class="flex-1 rounded-lg"
							@click="handleSave"
						>
							{{ $t('common.save') }}
						</n-button>
					</div>
				</div>
			</template>

			<template v-else>
				<div class="w-full flex py-2 pt-4 items-center overflow-hidden">
					<n-button
						type="primary"
						size="small"
						class="flex-1 px-6 rounded-lg transition-all duration-300 hover:opacity-90 mr-2"
						:class="{ '-ml-full': isFocused, 'ml-0': !isFocused }"
						@click="handleAdd"
					>
						{{ $t('chat.createPrompt') }}
					</n-button>

					<n-input
						ref="searchInputRef"
						v-model:value="searchText"
						type="text"
						size="small"
						placeholder="搜索提示词"
						class="search-input transition-width duration-300 rounded-lg cursor-pointer"
						:class="{ 'w-full!': isFocused, 'w-36px!': !isFocused }"
						@focus="isFocused = true"
						@blur="handleSearchBlur"
						@keyup="handleSearch"
						@keydown.enter="handleSearch"
					>
						<template #prefix>
							<n-icon>
								<Search />
							</n-icon>
						</template>
					</n-input>
				</div>
				<div class="flex-1 overflow-hidden">
					<n-scrollbar class="h-full">
						<template v-if="!filteredPromptList.length">
							<div class="flex flex-col items-center justify-center h-[calc(100vh-280px)]">
								<n-empty
									class="animate-fade-in"
									:description="$t('chat.noPrompts')"
								>
									<template #icon>
										<div class="text-5xl text-gray-300 mb-2">
											<n-icon><ChatbubbleEllipsesOutline /></n-icon>
										</div>
									</template>
								</n-empty>
							</div>
						</template>

						<div v-else class="space-y-3 py-2">
							<div
								v-for="item of filteredPromptList"
								:key="item.promptId"
								class="group relative bg-white dark:bg-dark-800 rounded-lg border border-gray-100 dark:border-dark-700 hover:border-primary transition-all duration-300 cursor-pointer"
							>
								<div class="w-full p-3" @click="handleSelect(item)">
									<div class="text-sm font-medium dark:text-gray-200 text-gray-800 mb-1">
										{{ item.title }}
									</div>
									<p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
										{{ item.content }}
									</p>
								</div>

								<div class="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
											<n-button text size="small">
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
				</div>
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.prompt-sidebar {
		transition: width 0.4s;

		&> :deep(.n-card__content) {
			padding: 0;
		}
	}

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

	:deep(.n-tabs-tab) {
		padding: 8px 12px !important;
	}

	:deep(.n-card) {
		--n-border-radius: 12px;
	}

	.search-input {
		&:deep(.n-input) {
			background: transparent;
		}
	}
</style>
