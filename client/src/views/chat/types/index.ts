export interface ChatParams {
	chatId: string
	previousId: string
}

// 对话
export interface Chat {
	chatId?: string
	chatName: string
	messages?: Message[]
	isEdit?: boolean
	delFlag?: number
}

// 消息
export interface Message {
	messageId?: string
	previousId?: string
	chatId: string
	messageText: string
	sender: string
	completed?: number
	delFlag?: number
}

// 指令
export interface Prompt {
	promptId?: string | undefined
	title: string
	content: string
	delFlag?: number
}
