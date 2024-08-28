<script lang="ts" setup>
import {
	ChatboxOutline,
	CheckmarkOutline,
	CloseOutline,
	TrashOutline,
	AddCircleOutline,
	ChatbubblesOutline
} from '@vicons/ionicons5'
import { EditOutlined, MenuFoldOutlined } from '@vicons/antd'
import type { Chat } from '../types'
import { useChatStore } from '@/store/chat'

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
	chatStore.hideChatSidebar()
}

function handleAdd() {
	chatStore.createChat()
}


async function handleSelect({ chatId }: Chat) {
	if (isActive(chatId))
		return

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
	dialog.warning({
		title: '清空',
		content: '您确定要清空对话吗',
		positiveText: '确定',
		negativeText: '取消',
		onPositiveClick: () => {
			chatStore.clearChatList().then(() => {
				message.success('清空成功')
			})
		},
	})
}


</script>

<template>
	<div v-if="sidebarVisible"
		class="w-260px h-full flex flex-col transition-all dark:bg-dark border-r border-r-#dedede dark:border-r-#eaeaea">
		<div class="flex flex-row justify-between items-center p-4">
			<div class="flex items-center text-gray-500">
				<n-icon size="22" class="mx-2">
					<ChatbubblesOutline />
				</n-icon>
				<h2 class="px-5 text-medium font-medium text-slate-600 dark:text-slate-200">
					{{ $t('chat.chatList') }}
				</h2>
			</div>
			<n-button class="w-10 h-10 bg-[var(--primary-color)] dark:bg-dark hover:bg-slate-200 rounded"
				@click="hideChatSidebar">
				<template #icon>
					<n-icon>
						<MenuFoldOutlined />
					</n-icon>
				</template>
			</n-button>
		</div>

		<div class="p-4">
			<n-button class="w-full h-10 rounded-2 dark:bg-dark" type="primary" @click="handleAdd">
				<template #icon>
					<n-icon>
						<AddCircleOutline />
					</n-icon>
				</template>
				{{ $t('chat.createChat') }}
			</n-button>
		</div>

		<n-scrollbar>
			<div class="flex flex-col w-full gap-3 p-4">
				<div v-for="(item, index) of chatList" :key="index" class="w-full">
					<n-input v-if="item.isEdit" v-model:value="item.chatName" class="items-center w-full h-11">
						<template #suffix>
							<n-icon size="14" class="mr-2 text-blue-800 cursor-pointer hover:text-gray-500"
								@click="handleEdit(item, false, $event)">
								<CheckmarkOutline />
							</n-icon>

							<n-icon size="14" class="text-blue-800  cursor-pointer hover:text-gray-500" @click="item.isEdit = false">
								<CloseOutline />
							</n-icon>
						</template>
					</n-input>

					<n-button v-else class="w-full h-11  justify-start  hover:bg-#fff rounded-2"
						:class="isActive(item.chatId) && ['selected']" @click="handleSelect(item)">
						<template #icon>
							<n-icon size="14">
								<ChatboxOutline />
							</n-icon>
						</template>

						<n-ellipsis :tooltip="false" class="text-12.5px"
							:class="isActive(item.chatId) && ['w-40', 'text-left', 'selected']">
							{{ item.chatName }}
						</n-ellipsis>

						<div v-if="isActive(item.chatId)" class="flex">
							<n-icon size="14" class="mr-1 text-gray-500 dark:color-gray-3  cursor-pointer "
								@click="handleEdit(item, true, $event)">
								<EditOutlined />
							</n-icon>

							<n-popconfirm placement="top" @positive-click="handleDelete(item, $event)">
								<template #trigger>
									<n-icon size="14" class="text-gray-500 dark:color-gray-3   cursor-pointer">
										<CloseOutline />
									</n-icon>
								</template>
								{{ $t('chat.removeConfirm') }}
							</n-popconfirm>
						</div>
					</n-button>
				</div>
			</div>
		</n-scrollbar>

		<div class="p-4">
			<n-button class="w-full gap-3 rounded-2" type="primary" @click="handleClear">
				<template #icon>
					<n-icon size="14">
						<TrashOutline />
					</n-icon>
				</template>
				{{ $t('chat.clearChat') }}
			</n-button>
		</div>
	</div>

</template>

<style lang="scss" scoped>
.selected {
	color: var(--n-primary-color)
}
</style>
