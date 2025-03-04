<script
	lang="ts"
	setup
>

import type { ChatParams, Message, Prompt } from '../types'
import { useScroll } from '@/hooks'
import { useChatStore } from '@/store/chat'
import {
	ChatbubblesOutline,
	PaperPlaneOutline,
	StopCircleOutline
} from '@vicons/ionicons5'
import ChatMessage from './message.vue'
import { local } from '@/utils'
import { fetchEventSource, EventStreamContentType } from '@microsoft/fetch-event-source'


const { t } = useI18n()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()

const inputRef = ref<Ref | null>(null)
const loading = ref<boolean>(false)

const chatStore = useChatStore()

// 显示对话记录侧边栏
function showChatSidebar() {
	chatStore.showSidebar = !chatStore.showSidebar
}

const prompt = computed(() => chatStore.prompt)
const promptList = computed(() => chatStore.promptList)

// 输入‘/’弹出指令
const promptOptions = computed(() => {
	if (prompt.value.startsWith('/')) {

		if (promptList.value.length === 0) {
			$message.warning('暂无指令, 请点击指令中心新建指令')
			return []
		}

		return promptList.value
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
// function onSelectPrompt(item: Prompt) {
// 	prompt.value = item.content
// }

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

			const lastMessage = chat.messages?.filter((i: Message) => i.sender === 'assistant').pop()
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
	const userMessage = await chatStore.createMessage({
		chatId: chatStore.activeId as string,
		messageText: message,
		sender: 'user',
		completed: 1
	})

	try {

		// 创建AI消息
		answer.value = await chatStore.createMessage({
			chatId: chatStore.activeId as string,
			previousId: userMessage?.messageId,
			messageText: '',
			sender: 'assistant',
			completed: 0
		})
	} catch (error) {
		console.error(error)
	}

	scrollToBottom()

	submitChat(answer.value)
}

const processedMsgIds = new Set<string>()

async function submitChat(answer: Message) {
	chatStore.prompt = ''
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
			if (msg.event === 'error') {
				console.error(msg)
				return
			}

			if (answer.completed === 1) {
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

function handleClick(tag: string) {
	console.log(tag)
	switch (tag) {
		case '指令中心':
			chatStore.showPromptSidebar = !chatStore.showPromptSidebar
			break
	}
}
</script>

<template>

	<div class="h-full flex flex-1 flex-col overflow-hidden bg-light dark:bg-dark transition-colors duration-300">
		<!-- header -->
		<div class="flex items-center justify-between px-6 py-2.5  backdrop-blur border-gray-200 dark:border-gray-800">
			<div class="flex gap-3">
				<n-button
					class="w-10 h-10 rounded-xl bg-white dark:bg-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					@click="showChatSidebar"
				>
					<template #icon>
						<n-icon>
							<ChatbubblesOutline />
						</n-icon>
					</template>
				</n-button>
			</div>
		</div>

		<!-- content -->
		<div class="flex-1 min-h-0">
			<div
				id="scrollRef"
				ref="scrollRef"
				class="h-full overflow-x-hidden overflow-y-auto px-4"
			>
				<template v-if="!chat?.messages?.length">
					<div class="flex flex-col justify-center h-full items-center space-y-4">
						<div class="text-4xl font-bold text-gray-800 dark:text-gray-200">
							{{ $t('chat.title') }}
						</div>
						<div class="text-base text-gray-500 dark:text-gray-400">
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
		</div>

		<!-- footer -->
		<div class="py-4 px-4 bg-white/80 dark:bg-dark/80 backdrop-blur shadow-md border-gray-200 dark:border-gray-800">
			<div class="max-w-4xl mx-auto">

				<div class="flex flex-wrap gap-2 mb-2">
					<n-tag
						v-for="tag in ['指令中心']"
						:key="tag"
						:bordered="true"
						type="primary"
						size="small"
						round
						class="cursor-pointer hover:bg-primary hover:text-white transition-colors"
						@click="handleClick(tag)"
					>
						{{ tag }}
					</n-tag>
				</div>

				<n-auto-complete
					v-model:value="chatStore.prompt"
					class="w-full"
					:options="promptOptions"
				>
					<template #default="{ handleInput, handleBlur, handleFocus }">
						<n-input
							ref="inputRef"
							v-model:value="prompt"
							type="textarea"
							rows="1"
							autosize
							class="rounded-xl shadow-sm hover:shadow-md focus:shadow-lg transition-shadow"
							:placeholder="$t('chat.chatPlaceholder')"
							@input="handleInput"
							@focus="handleFocus"
							@blur="handleBlur"
							@keypress="handleEnter"
						>
							<template #suffix>
								<div class="flex gap-2">
									<n-button
										:bordered="false"
										:loading="loading"
										class="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
										@click="handleSubmit"
									>
										<template #icon>
											<n-icon size="18">
												<PaperPlaneOutline />
											</n-icon>
										</template>
									</n-button>

									<n-button
										v-if="loading"
										:bordered="false"
										class="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
										@click="handleStop"
									>
										<template #icon>
											<n-icon size="20">
												<StopCircleOutline />
											</n-icon>
										</template>
									</n-button>
								</div>
							</template>
						</n-input>
					</template>
				</n-auto-complete>
			</div>
		</div>
	</div>

	<!-- <ChatPrompt @select-prompt="onSelectPrompt" /> -->
</template>

<style lang="scss" scoped>
:deep(.n-input) {
	--n-border-radius: 12px;
}
</style>
