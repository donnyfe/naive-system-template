<script lang="ts" setup>
import type { PopoverInst } from 'naive-ui'
import type { ChatParams, Message, Prompt } from '../types'
import { useScroll } from '@/hooks'
import { useChatStore } from '@/store/chat'
import { usePromptStore } from '@/store/prompt'
import Queue from '@/utils/queue'
import {
	ChatbubblesOutline,
	GridOutline,
	PaperPlaneOutline,
	StopCircleOutline
} from '@vicons/ionicons5'
import ChatMessage from './message.vue'
import ChatPrompt from './prompt.vue'
import {local} from '@/utils'
import { fetchEventSource, EventStreamContentType } from '@microsoft/fetch-event-source'


const { t } = useI18n()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()

const inputRef = ref<Ref | null>(null)
const loading = ref<boolean>(false)

const chatStore = useChatStore()

const sidebarVisible = computed(() => {
	return chatStore.showSidebar
})

// 显示对话记录侧边栏
function showChatSidebar() {
	chatStore.showSidebar = true
}

const popoverPromptRef = ref<PopoverInst | null>(null)
const promptStore = usePromptStore()
const prompt = ref<string>('')

// 输入‘/’弹出指令
const promptOptions = computed(() => {
	if (prompt.value.startsWith('/')) {
		const promptList = promptStore.promptList
		if (promptList.length === 0) {
			promptStore.getPromptList()
		}
		return promptList
			.filter((item: Prompt) =>
				item.content.toLowerCase().includes(prompt.value.substring(1).toLowerCase())
			)
			.map((item: Prompt) => {
				return {
					label: item.content,
					value: item.content
				}
			})
	} else {
		return []
	}
})

// 选择指令
function onSelectPrompt(item: Prompt) {
	prompt.value = item.content
	popoverPromptRef.value?.setShow(false)
}

const chat = computed(() => chatStore.chat)
const chatId = ref<string | undefined>(chatStore.activeId)

const answer = ref<Message>({
	chatId: '',
	previousId: '',
	messageId: '',
	messageText: '',
	sender: '',
	completed: 0
})

watch(
	() => chatStore.chat,
	(newVal) => {
		if (newVal) {
			const chat = toRaw(newVal)
			chatId.value = chat.chatId

			const lastMessage = chat.messages?.filter((i) => i.sender === 'assistant').pop()
			if (lastMessage) {
				answer.value = lastMessage
			}
		} else {
			chatStore.chat = null
		}
	}
)

onMounted(async () => {
	scrollToBottom()
	if (inputRef.value) {
		inputRef.value?.focus()
	}
})

// 提交信息
async function handleSubmit() {
	if (loading.value) return

	const message = prompt.value.trim()
	if (!message) return

	const chatId = chatStore.activeId
	// 不存在对话则创建新对话
	if (!chatId) {
		await chatStore.createChat({
			chatName: message.slice(0, 30)
		})
	}

	// 创建用户消息
	const params: Message = {
		chatId: chatStore.activeId as string,
		messageText: message,
		sender: 'user',
		completed: 1
	}
	const userMessage = await chatStore.createMessage(params)

	// 创建AI消息
	const aiMessage = await chatStore.createMessage({
		chatId: chatStore.activeId as string,
		previousId: userMessage?.messageId,
		messageText: '',
		sender: 'assistant',
		completed: 0
	})

	scrollToBottom()

	// 创建回答
	answer.value = aiMessage as Message
	submitChat(answer.value)
}

const processedMsgIds = new Set<string>()

async function submitChat(answer: Message) {
	prompt.value = ''
	loading.value = true

	const chatId = chatStore.activeId
	if (!chatId) {
		return console.error('缺少对话')
	}

	const parmas: ChatParams = {
		chatId: chatId as string,
		previousId: answer.previousId as string
	}


	/**
	 * 流式响应
	 * @docs https://www.npmjs.com/package/@microsoft/fetch-event-source
	 */
	const abortCtrl = new AbortController()

	await fetchEventSource('/api/chat/submit', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
			'Authorization': `Bearer ${local.get('accessToken') || ''}`
		},
		body: JSON.stringify(parmas),
		signal: abortCtrl.signal,
		async onopen(response: any) {
			if (response.ok && response.headers.get('Content-type').includes(EventStreamContentType)) {
				return;
			}
		},
		async onmessage(msg: any) {
			if(msg.event === 'error') {
				console.error(msg)
				return
			}
			if (!msg.data) return
			try {
				let message = JSON.parse(msg.data)

				answer.messageText += message.result
				scrollToBottomIfAtBottom()

				if (message.is_end) {
					answer.completed = 1
					loading.value = false
					await updateMessage(toRaw(answer))
				}
			} catch (err) {
				console.error('Error parsing message:', err)
			}
		},
		onclose() {
			console.log('SSE connection closed')
			loading.value = false
			processedMsgIds.clear()
		},
		onerror(err: any) {
			loading.value = false
			console.error('Stream error:', err)
		}
	})
}

/** 更新消息 */
async function updateMessage(msg: Message) {
	const params: Message = {
		chatId: msg.chatId,
		previousId: msg.previousId,
		messageId: msg.messageId,
		messageText: msg.messageText,
		sender: msg.sender,
		completed: 1
	}
	await chatStore.updateMessage(params)
}

/**
 * 监听回车键提交
 * @param event
 */
function handleEnter(event: KeyboardEvent) {
	if (event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault()
		handleSubmit()
	}
}

/**
 * 重新生成
 * @param answer
 */
async function onRegenerate(answer: Message) {
	answer.messageText = ''
	answer.completed = 0
	loading.value = true
	submitChat(answer)
}

/**
 * 停止生成
 */
async function handleStop() {
	if (loading.value) {
		if (answer.value.chatId) {
			answer.value.messageText = t('chat.chatStop')
			answer.value.completed = 1
			await updateMessage(toRaw(answer.value))
		}
		loading.value = false
	}
}
</script>

<template>
	<div class="relative wh-full flex overflow-hidden dark:bg-dark">
		<div
			class="absolute z-10 flex justify-between w-full lg:py-4 lg:px-6 bg-#f7f7f7 dark:bg-dark border-b border-#ddd"
		>
			<div class="flex gap-3">
				<n-button
					v-if="!sidebarVisible"
					class="w-10 h-10 bg-#fff dark:bg-dark hover:opacity-70 rounded"
					@click="showChatSidebar"
				>
					<template #icon>
						<n-icon>
							<ChatbubblesOutline />
						</n-icon>
					</template>
				</n-button>
			</div>
			<div class="relative flex">
				<n-popover ref="popoverPromptRef" trigger="click" placement="bottom-end" :width="400">
					<template #trigger>
						<n-button
							class="action-button w-10 h-10 bg-white dark:bg-dark dark:hover:border-emerald hover:opacity-70 rounded"
						>
							<template #icon>
								<n-icon size="18">
									<GridOutline />
								</n-icon>
							</template>
						</n-button>
					</template>
					<ChatPrompt @select-prompt="onSelectPrompt" />
				</n-popover>
			</div>
		</div>
		<div
			class="w-full flex flex-col justify-center flex-auto overflow-hidden bg-#f7f7f7 dark:bg-dark p-t-20"
		>
			<div id="scrollRef" ref="scrollRef" class="w-full h-full overflow-x-hidden p-b-20">
				<template v-if="!chat?.messages?.length">
					<div
						class="flex flex-col justify-center h-full items-center mx-auto space-y-4 max-w-600px"
					>
						<div class="text-4xl font-semibold text-center text-gray-800 dark:color-emerald">
							{{ $t('chat.title') }}
						</div>
						<div class="text-base text-center text-gray-500 dark:color-emerald-300">
							{{ $t('chat.intro') }}
						</div>
					</div>
				</template>
				<template v-else>
					<ChatMessage
						v-for="(item, index) of chat?.messages"
						:key="index"
						:item="item.messageId === answer?.messageId ? (answer as Message) : item"
						:loading="item.completed === 0"
						@regenerate="onRegenerate"
					/>
				</template>
			</div>
			<div class="w-full py-4 bg-#f7f7f7 dark:bg-dark border-t border-#ddd">
				<div class="flex-center">
					<n-auto-complete v-model:value="prompt" class="w-60%" :options="promptOptions">
						<template #default="{ handleInput, handleBlur, handleFocus }">
							<n-input
								ref="inputRef"
								v-model:value="prompt"
								type="textarea"
								rows="1"
								autosize
								round
								class="py-2 rounded-2"
								placeholder="输入消息或“/”以选择提示..."
								@input="handleInput"
								@focus="handleFocus"
								@blur="handleBlur"
								@keypress="handleEnter"
							>
								<template #suffix>
									<n-button
										:bordered="false"
										:loading="loading"
										class="w-20px"
										@click="handleSubmit"
									>
										<template #icon>
											<n-icon size="16">
												<PaperPlaneOutline />
											</n-icon>
										</template>
									</n-button>
									<n-button v-if="loading" :bordered="false" class="w-20px" @click="handleStop">
										<template #icon>
											<n-icon size="20">
												<StopCircleOutline />
											</n-icon>
										</template>
									</n-button>
								</template>
							</n-input>
						</template>
					</n-auto-complete>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
