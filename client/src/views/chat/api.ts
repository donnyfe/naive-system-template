import type { Chat, ChatParams, Message, Prompt } from './types'
import http, { httpStream, type Result } from '@/http/request'

/**
 * Conversation对话相关接口
 *
 * @returns
 */

/** 新增对话 */
export async function createChat(params?: Chat) {
	return http.post<Result<Chat>>('/api/chat/create', params)
}

/** 更新对话 */
export async function updateChat(params: Chat) {
	return http.post<Result<Chat>>('/api/chat/update', params)
}

/** 移除对话 */
export async function removeChat(chatId: string) {
	return http.post<Result<void>>(`/api/chat/remove/${chatId}`)
}

/** 清空列表 */
export const clearChat = async () => http.post<Result<void>>('/api/chat/clear')

/** 获取对话消息列表 */
export async function queryChat(chatId: string) {
	return http.get<Result<Chat>>(`/api/chat/${chatId}`)
}

/** 获取对话列表 */
export async function queryChatList() {
	return http.post<Result<Chat[]>>('/api/chat/list')
}

/**
 * Message对话相关接口
 *
 * @returns
 */

/** 新增消息 */
export async function createMessage(params: Message) {
	return http.post<Result<Message>>('/api/chat/message/create', params)
}

/** 更新消息 */
export async function updateMessage(params: Message) {
	return http.post<Result<Message>>('/api/chat/message/update', params)
}

/**
 * Prompt对话相关接口
 *
 * @returns
 */

/** 新增指令 */
export async function createPrompt(params: Prompt) {
	return http.post<Result<Prompt>>('/api/prompt/create', params)
}

/** 移除指令 */
export async function removePrompt(promptId: string) {
	return http.post(`/api/prompt/remove/${promptId}`)
}

/** 修改指令 */
export async function updatePrompt(params: Prompt) {
	return http.post<Result<Prompt>>('/api/prompt/update', params)
}

/** 获取指令列表 */
export async function queryPromptList() {
	return http.post<Result<Prompt[]>>('/api/prompt/list')
}

/** 对话提交 */
export async function chatSubmit(params: ChatParams) {
	return httpStream('/api/chat/submit', params)
}
