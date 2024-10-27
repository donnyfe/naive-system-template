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
	<div ref="messageRef" class="message w-full">
		<div class="w-full flex justify-start px-12 pr-18 py-4">
			<div class="w-32px h-32px mr-16px">
				<ChatAvatar visible :type="item.sender" />
			</div>

			<div class="w-auto max-w-full">
				<div
					class="w-auto max-w-full px-4 py-2 rounded-xl border border-gray-200 bg-#fff dark:bg-dark"
				>
					<n-space v-if="!item.messageText">
						<n-spin :size="10" />
						<span class="color-gray-400">{{ $t('chat.thinking') }}</span>
					</n-space>
					<Text
						v-else
						ref="textRef"
						:type="isAi ? 'markdown' : 'text'"
						:text="item?.messageText"
						:loading="loading"
					/>
				</div>

				<div
					v-if="isAi && !loading"
					class="w-full flex flex-row items-center justify-between py-2 pb-0 border-gray-200"
				>
					<n-button
						:bordered="false"
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						@click="handleRegenerate"
					>
						<template #icon>
							<n-icon size="14">
								<Refresh />
							</n-icon>
						</template>
						{{ $t('chat.regenerate') }}
					</n-button>

					<n-button
						:bordered="false"
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						@click="handleCopy"
					>
						<template #icon>
							<n-icon size="14">
								<CopyOutline />
							</n-icon>
						</template>
					</n-button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
