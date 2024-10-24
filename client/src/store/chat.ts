import type { Chat, Message } from '@/views/chat/types'
import {
	clearChat,
	createChat,
	createMessage,
	queryChat,
	queryChatList,
	removeChat,
	updateChat,
	updateMessage
} from '@/views/chat/api'
import { defineStore } from 'pinia'

export interface ChatState {
	showSidebar: boolean
	activeId: string | undefined
	chat: Chat | null
	chatList: Chat[]
}

export const useChatStore = defineStore('chat-store', {
	state: (): ChatState => ({
		showSidebar: true,
		activeId: '',
		chat: null,
		chatList: []
	}),

	actions: {
		showChatSidebar() {
			this.showSidebar = true
		},
		hideChatSidebar() {
			this.showSidebar = false
		},
		/**
		 * 创建对话
		 */
		async createChat(params?: Chat) {
			params = params || { chatName: '新建对话' }
			const res = await createChat(params)
			this.chatList.unshift(res.data)
			this.activeId = res.data.chatId
			this.chat = null
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
			this.$reset()
		},

		/**
		 * 查询对话
		 */
		async queryChatList() {
			const res = await queryChatList()

			const list: Chat[] = res.data || []

			if (list.length > 0) {
				this.chatList = list
				this.activeId = list[0].chatId as string
				this.queryMessage(this.activeId)
			}
			else {
				this.$reset()
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
			await updateMessage(message)
			this.queryMessage(message.chatId)
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
		}
	}
})
