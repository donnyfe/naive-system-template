<script lang="ts" setup>
import type { Chat } from '../types'
import { useChatStore } from '@/store/chat'
import { EditOutlined, MenuFoldOutlined } from '@vicons/antd'
import {
	Search,
	ChatboxOutline,
	ChatbubblesOutline,
	CheckmarkOutline,
	CloseOutline,
	TrashOutline,
	ChatbubbleEllipsesOutline
} from '@vicons/ionicons5'

const dialog = useDialog()
const message = useMessage()
const chatStore = useChatStore()

const sidebarVisible = computed(() => {
	return chatStore.showSidebar
})

const chatList = computed(() => {
	return chatStore.chatList
})

onMounted(async () => {
	chatStore.queryChatList()
})

function hideChatSidebar() {
	chatStore.showSidebar = false
}

function handleAdd() {
	const params = {
		chatName: '新建对话'
	}
	chatStore.createChat(params)
}

async function handleSelect({ chatId }: Chat) {
	if (isActive(chatId)) return

	await chatStore.setActive(chatId as string)
}

function handleEdit(item: Chat, isEdit: boolean, event?: MouseEvent) {
	event?.stopPropagation()
	item.isEdit = isEdit
	if (!isEdit) {
		const { chatId, chatName } = item
		chatStore.updateChat({ chatId, chatName })
	}
}

function handleDelete(item: Chat, event?: MouseEvent) {
	event?.stopPropagation()
	chatStore.removeChat(item.chatId as string)
}

function isActive(chatId: string | undefined) {
	return chatStore.activeId === chatId
}

function handleClear() {
	if (!chatStore.chatList.length) {
		message.warning('当前没有对话')
		return
	}
	dialog.warning({
		title: '清空',
		content: '您确定要清空对话吗',
		positiveText: '确定',
		negativeText: '取消',
		onPositiveClick: () => {
			chatStore.clearChatList().then(() => {
				message.success('清空成功')
			})
		}
	})
}

// 添加新的动画相关的计算属性
const listTransition = computed(() => ({
	enter: 'transition-all duration-300 ease-out',
	leave: 'transition-all duration-200 ease-in',
	enterFrom: 'opacity-0 -translate-x-4',
	enterTo: 'opacity-100 translate-x-0',
	leaveFrom: 'opacity-100 translate-x-0',
	leaveTo: 'opacity-0 -translate-x-4'
}))

// 添加搜索相关的响应式变量
const searchInputRef = ref<HTMLElement | null>(null)
const searchText = ref('')
const isFocused = ref(false)

// 添加搜索过滤的计算属性
const filteredChatList = computed(() => {
	if (!searchText.value) return chatList.value

	return chatList.value.filter(chat =>
		chat.chatName.toLowerCase().includes(searchText.value.toLowerCase())
	)
})

// 添加搜索框失焦处理
function handleSearchBlur() {
	if (!searchText.value) {
		isFocused.value = false
	}
}
</script>

<template>
	<div
		class="slidebar shadow-lg overflow-hidden"
		:class="[sidebarVisible ? 'w-240px' : 'w-0']">

		<div
			class="slidebar-content w-240px px-3 h-full flex flex-col bg-white/90 dark:bg-dark/90
					 backdrop-blur-xl border-r border-gray-100/50 dark:border-gray-800/50
					 transition-all duration-300 ease-out"

		>
			<div class="flex-none h-16 flex items-center justify-between
						backdrop-blur-sm border-b border-gray-100/50 dark:border-gray-800/50">
				<div class="flex items-center gap-2.5 text-gray-800 dark:text-gray-100">
					<n-icon size="24" class="text-primary-500">
						<ChatbubblesOutline />
					</n-icon>

					<span class="text-[16px] font-medium tracking-wide">{{ $t('chat.historyChat') }}</span>
				</div>

				<n-button
					quaternary
					circle
					class="text-gray-500 hover:text-gray-700 dark:text-gray-400
							 dark:hover:text-gray-200 transition-colors"
					@click="hideChatSidebar"
				>
					<template #icon>
						<n-icon><MenuFoldOutlined /></n-icon>
					</template>
				</n-button>
			</div>

			<div class="w-full py-2 flex items-center gap-2 overflow-hidden">
				<n-button
					type="primary"
					size="small"
					class="flex-1 px-6 rounded-lg transition-margin duration-300 hover:opacity-90"
					:class="{ '-ml-full': isFocused, 'ml-0': !isFocused }"
					@click="handleAdd"
				>
					{{ $t('chat.createChat') }}
				</n-button>

				<n-input
					ref="searchInputRef"
					v-model:value="searchText"
					type="text"
					size="small"
					placeholder="搜索对话"
					class="search-input transition-width duration-300 rounded-lg cursor-pointer"
					:class="{ 'w-full!': isFocused, 'w-36px!': !isFocused }"
					@focus="isFocused = true"
					@blur="handleSearchBlur"
				>
					<template #prefix>
						<n-icon>
							<Search />
						</n-icon>
					</template>
				</n-input>
			</div>

			<n-scrollbar class="flex-1">
				<template v-if="!chatList.length">
					<div class="flex flex-col items-center justify-center h-[calc(100vh-350px)]">
						<n-empty
							class="animate-fade-in"
							:description="$t('chat.noChats')"
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

				<div class="flex flex-col gap-2">
					<TransitionGroup
						:enter-active-class="listTransition.enter"
						:leave-active-class="listTransition.leave"
						:enter-from-class="listTransition.enterFrom"
						:enter-to-class="listTransition.enterTo"
						:leave-from-class="listTransition.leaveFrom"
						:leave-to-class="listTransition.leaveTo"
					>
						<div v-for="item in filteredChatList" :key="item.chatId">
							<n-input
								v-if="item.isEdit"
								v-model:value="item.chatName"
								size="large"
								class="h-10 rounded-lg"
							>
								<template #suffix>
									<div class="flex gap-1.5 mr-1">
										<n-button
											quaternary
											circle
											size="small"
											class="hover:text-primary-600 transition-colors"
											@click="handleEdit(item, false, $event)"
										>
											<template #icon>
												<n-icon><CheckmarkOutline /></n-icon>
											</template>
										</n-button>
										<n-button
											quaternary
											circle
											size="small"
											class="hover:text-gray-600 transition-colors"
											@click="item.isEdit = false"
										>
											<template #icon>
												<n-icon><CloseOutline /></n-icon>
											</template>
										</n-button>
									</div>
								</template>
							</n-input>

							<n-button
								v-else
								block
								text
								class="h-10 justify-start rounded-lg transition-all duration-300
										 hover:(bg-primary/8 transform translate-x-1)
										 dark:hover:bg-gray-800/80 group"
								:class="isActive(item.chatId) &&
										 'bg-primary/12 text-primary-600 shadow-sm'"
								@click="handleSelect(item)"
							>
								<div class="flex items-center gap-3 flex-1 min-w-0">
									<n-icon size="18" class="flex-none">
										<ChatboxOutline />
									</n-icon>

									<div class="flex-1 w-60%">
										<n-ellipsis
											:tooltip="false"
											class="text-[14px] font-medium w-full"
										>
											{{ item.chatName }}
										</n-ellipsis>
									</div>

									<div class="flex-none flex justify-end gap-1.5 opacity-0
												 group-hover:opacity-100 transition-all duration-300"
									>
										<n-button
											quaternary
											circle
											size="small"
											class="hover:text-primary-600 transition-colors"
											@click="handleEdit(item, true, $event)"
										>
											<template #icon>
												<n-icon><EditOutlined /></n-icon>
											</template>
										</n-button>

										<n-popconfirm
											placement="top"
											@positive-click="handleDelete(item, $event)"
										>
											<template #trigger>
												<n-button
													quaternary
													circle
													size="small"
													class="hover:text-error transition-colors"
												>
													<template #icon>
														<n-icon><CloseOutline /></n-icon>
													</template>
												</n-button>
											</template>
											{{ $t('chat.removeConfirm') }}
										</n-popconfirm>
									</div>
								</div>
							</n-button>
						</div>
					</TransitionGroup>
				</div>
			</n-scrollbar>

			<div class="flex-none py-3 border-t border-gray-100/50 dark:border-gray-800/50">
				<n-tooltip placement="top">
					<template #trigger>
						<n-button
							circle
							class="h-8 rounded-xl font-medium transition-all duration-300
									transform hover:-translate-y-0.5
									shadow hover:shadow-lg"
							@click="handleClear"
						>
							<template #icon>
								<n-icon class="text-[18px]"><TrashOutline /></n-icon>
							</template>
						</n-button>
					</template>
					{{ $t('chat.clearChat') }}
				</n-tooltip>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.n-button.selected {
		color: var(--n-primary-color);
		background-color: rgba(var(--n-primary-color-rgb), 0.1);
	}

	.slidebar {
		position: relative;
		transition: width 0.4s;

		:deep(.n-card__content) {
			padding: 0;
		}
	}
	.slidebar-content {
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		opacity: 1;
		transition: opacity 0.2s;
	}

	.search-input {
		&:deep(.n-input) {
			background: transparent;
		}
	}
</style>
