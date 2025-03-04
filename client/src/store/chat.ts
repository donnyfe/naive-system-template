import type { Chat, Message, Prompt } from '@/views/chat/types'
import {
	clearChat,
	createChat,
	createMessage,
	queryChat,
	queryChatList as queryChatListApi,
	removeChat,
	updateChat,
	updateMessage as updateMessageApi,
	queryPromptList,
	removePrompt
} from '@/views/chat/api'
import { defineStore } from 'pinia'

export interface ChatState {
	showSidebar: boolean
	showPromptSidebar: boolean
	activeId: string | undefined
	chatList: Chat[],
	chat: Chat | null
	promptList: Prompt[],
	prompt: string
	searchPromptList: Prompt[]
}

export const useChatStore = defineStore('chat-store', {
	state: (): ChatState => ({
		showSidebar: true,
		showPromptSidebar: false,
		activeId: '', // 选中激活的对话
		chatList: [], // 对话列表
		chat: null, // 当前对话
		promptList: [], // 指令列表
		prompt: '', // 当前指令
		searchPromptList: []
	}),

	actions: {
		/**
		 * 创建对话
		 */
		async createChat(params?: Chat) {
			try {
				const res = await createChat(params)

				this.chat = res.data
				this.activeId = res.data.chatId as string

				await this.queryChatList()
			} catch (error: any) {
				throw new Error('创建对话失败', error.message)
			}
		},

		/**
		 * 删除对话
		 * @param chatId
		 */
		async removeChat(chatId: string) {
			await removeChat(chatId)
			this.queryChatList()
		},

		/**
		 * 更新对话
		 * @param chat
		 */
		async updateChat(chat: Chat) {
			await updateChat(chat)
			this.queryChatList()
		},

		/**
		 * 清空对话
		 */
		async clearChatList() {
			await clearChat()

			this.chatList = []
			this.chat = null
			this.activeId = undefined
		},

		/**
		 * 查询对话
		 */
		async queryChatList() {
			const res = await queryChatListApi()

			try {
				const list: Chat[] = res.data || []
				this.chatList = list
			} catch (error: any) {
				throw new Error('查询对话列表失败', error.message)
			}
		},

		/**
		 * 激活对话
		 * @param chatId
		 */
		async setActive(chatId: string) {
			if (this.activeId !== chatId) {
				const res = await queryChat(chatId)
				this.chat = res.data
				this.activeId = chatId
			}
		},

		/**
		 * 创建消息
		 * @param message
		 * @returns
		 */
		async createMessage(message: Message) {
			const res = await createMessage(message)
			await this.queryMessage(message.chatId)
			return res.data
		},

		/**
		 * 更新消息
		 * @param message
		 * @returns
		 */
		async updateMessage(message: Message) {

			try {
				await updateMessageApi(message)
				await this.queryMessage(message.chatId)
			} catch (error: any) {
				throw new Error('更新消息失败', error.message)
			}
		},

		/**
		 * 获取消息
		 * @param chatId
		 * @returns
		 */
		async queryMessage(chatId: string) {
			const res = await queryChat(chatId)
			this.chat = res.data
			return res.data
		},

		async getPromptList() {
			const res = await queryPromptList()
			this.promptList = res.data.length > 0 ? res.data : []
			return this.promptList
		},

		/**
		 * 删除提示词
		 * @param promptId
		 */
		async removePrompt(promptId: string) {
			await removePrompt(promptId)
			await this.getPromptList()
		},

		/**
		 * 搜索提示词
		 * @param keyword 搜索关键词
		 */
		searchPrompts(keyword: string) {
			if (!keyword.trim()) {
				this.searchPromptList = this.promptList
				return
			}

			const searchText = keyword.toLowerCase()
			this.searchPromptList = this.promptList.filter(prompt =>
				prompt.title.toLowerCase().includes(searchText) ||
				prompt.content.toLowerCase().includes(searchText)
			)
		}
	}
})
