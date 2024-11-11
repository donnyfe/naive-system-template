<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useAuthStore } from '@/store'

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const authStore = useAuthStore()
const isRead = ref(false)

const rules = {
	username: {
		required: true,
		trigger: 'blur',
		message: t('login.accountRuleTip')
	},
	password: {
		required: true,
		trigger: 'blur',
		message: t('login.passwordRuleTip')
	},
	resetPassword: {
		required: true,
		trigger: 'blur',
		message: t('login.checkPasswordRuleTip')
	}
}
const form = ref({
	username: '',
	password: '',
	resetPassword: ''
})

const isLoading = ref(false)

const formRef = ref<FormInst | null>(null)

function handleRegister() {
	if (!isRead.value) {
		return $message.warning('请阅读并同意用户协议')
	}

	formRef.value?.validate(async (error: any) => {
		if (error) return
		isLoading.value = true
		const { username, password } = form.value
		// 实现前端加密传给后端
		// password = encrypt(password)
		const { success, message } = await authStore.register(username, password)
		if (!success) return
		$message.success(message)

		isLoading.value = false

		toLogin()
	})
}

function toLogin() {
	emit('update:modelValue', 'loginForm')
}
</script>

<template>
	<div>
		<n-h2 depth="3" class="text-center">
			{{ $t('login.registerTitle') }}
		</n-h2>
		<n-form ref="formRef" :rules="rules" :model="form" :show-label="false" size="large">
			<n-form-item path="username">
				<n-input
					v-model:value="form.username"
					clearable
					:placeholder="$t('login.accountPlaceholder')"
				/>
			</n-form-item>

			<n-form-item path="password">
				<n-input
					v-model:value="form.password"
					type="password"
					:placeholder="$t('login.passwordPlaceholder')"
					clearable
					autocomplete="current-password"
					show-password-on="click"
				>
					<template #password-invisible-icon>
						<icon-park-outline-preview-close-one />
					</template>
					<template #password-visible-icon>
						<icon-park-outline-preview-open />
					</template>
				</n-input>
			</n-form-item>

			<n-form-item path="resetPassword">
				<n-input
					v-model:value="form.resetPassword"
					type="password"
					:placeholder="$t('login.checkPasswordPlaceholder')"
					clearable
					autocomplete="current-password"
					show-password-on="click"
				>
					<template #password-invisible-icon>
						<icon-park-outline-preview-close-one />
					</template>
					<template #password-visible-icon>
						<icon-park-outline-preview-open />
					</template>
				</n-input>
			</n-form-item>

			<n-form-item>
				<n-space vertical :size="20" class="w-full">
					<n-checkbox v-model:checked="isRead">
						{{ $t('login.readAndAgree') }}
						<n-button type="primary" text>
							{{ $t('login.userAgreement') }}
						</n-button>
					</n-checkbox>
					<n-button block type="primary" @click="handleRegister">
						{{ $t('login.signUp') }}
					</n-button>
					<n-flex justify="center">
						<n-text>{{ $t('login.haveAccountText') }}</n-text>
						<n-button text type="primary" @click="toLogin">
							{{ $t('login.signIn') }}
						</n-button>
					</n-flex>
				</n-space>
			</n-form-item>
		</n-form>
	</div>
</template>

<style scoped></style>
