<script setup lang="ts">
import type { Message } from '../types'
import { copyToClip } from '@/utils'
import { CopyOutline, Refresh } from '@vicons/ionicons5'
import ChatAvatar from './avatar.vue'
import Text from './text.vue'

interface Props {
	item: Message
	loading: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['regenerate'])
const { t } = useI18n()
const message = useMessage()

const textRef = ref<HTMLElement>()
const messageRef = ref<HTMLElement>()
const isAi = ref(props.item.sender === 'assistant')

// 添加过渡动画控制
const showActions = ref(false)

function handleRegenerate() {
	messageRef.value?.scrollIntoView()
	emit('regenerate', props.item)
}

async function handleCopy() {
	try {
		await copyToClip(props.item?.messageText || '')
		message.success(t('common.copySuccess'))
	} catch {
		message.error(t('common.copyFailed'))
	}
}
</script>

<template>
	<div ref="messageRef" class="message w-full transition-all">
		<div class="w-full flex justify-start px-4 sm:px-8 py-3 mb-4">
			<div class="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 flex-shrink-0">
				<ChatAvatar visible :type="item.sender === 'assistant' ? 'assistant' : 'user'" />
			</div>

			<div class="flex-grow max-w-[85%]" @mouseenter="showActions = true" @mouseleave="showActions = false">
				<n-card
					:bordered="false"
					class="message-bubble relative rounded-xl shadow-sm"
					:class="[
						isAi
							? 'bg-gray-50 dark:bg-gray-800'
							: 'bg-primary-50 dark:bg-primary-900'
					]"
				>
					<n-space v-if="!item.messageText" align="center" class="px-1">
						<n-spin size="small" />
						<span class="text-gray-400 text-sm">{{ $t('chat.thinking') }}</span>
					</n-space>

					<Text
						v-else
						ref="textRef"
						:type="isAi ? 'markdown' : 'text'"
						:text="item?.messageText"
						:loading="loading"
					/>

					<div
						v-if="isAi && !loading"
						class="action-buttons absolute -bottom-8 right-0"

					>
						<n-space>
							<n-button
								size="tiny"
								quaternary
								class="!text-gray-500 hover:!text-primary"
								@click="handleRegenerate"
							>
								<template #icon>
									<n-icon><Refresh /></n-icon>
								</template>
								<span class="text-xs">{{ $t('chat.regenerate') }}</span>
							</n-button>

							<n-button
								size="tiny"
								quaternary
								class="!text-gray-500 hover:!text-primary"
								@click="handleCopy"
							>
								<template #icon>
									<n-icon><CopyOutline /></n-icon>
								</template>
							</n-button>
						</n-space>
					</div>
				</n-card>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.message-bubble {
	transition: all 0.2s ease-in-out;

	&:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}
}

.action-buttons {
	transition: all 0.2s ease-in-out;
}

:deep(.n-card) {
	--n-border-radius: 1rem;
	--n-padding: 0.75rem 1rem;
}
</style>
