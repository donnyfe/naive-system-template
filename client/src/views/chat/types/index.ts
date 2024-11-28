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
}

// 消息
export interface Message {
	chatId: string
	sender: string
	previousId?: string
	messageId: string
	messageText: string
	completed?: number
}

// 指令
export interface Prompt {
	promptId?: string | undefined
	title: string
	content: string
}
