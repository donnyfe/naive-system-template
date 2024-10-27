<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useAuthStore } from '@/store'
import {
	local
	// throttle
} from '@/utils'
import { encrypt } from '@/utils/aes'
import { useThrottleFn } from '@vueuse/core'

const emit = defineEmits(['update:modelValue'])

const authStore = useAuthStore()

function toOtherForm(type: any) {
	emit('update:modelValue', type)
}

const { t } = useI18n()
const rules = computed(() => {
	return {
		username: {
			required: true,
			trigger: 'blur',
			message: t('login.accountRuleTip')
		},
		password: {
			required: true,
			trigger: 'blur',
			message: t('login.passwordRuleTip')
		}
	}
})
const form = reactive({
	username: '',
	password: '',
	captcha: ''
})

const captchaUrl = ref('')
const baseUrl = import.meta.env.VITE_AXIOS_BASE_URL

const initCaptcha = useThrottleFn(() => {
	captchaUrl.value = `${baseUrl}/auth/captcha?${Date.now()}`
}, 500)
initCaptcha()

const isRemember = ref(false)
const isLoading = ref(false)

const formRef = ref<FormInst | null>(null)

function handleLogin() {
	formRef.value?.validate(async (error) => {
		if (error) return

		isLoading.value = true
		const { username, password } = form

		if (isRemember.value) {
			local.set('loginAccount', { username, password: encrypt(password) })
		} else {
			local.remove('loginAccount')
		}
		const data = { ...toRaw(form) }
		// 实现前端加密传给后端
		// data.password = encrypt(password)

		await authStore.login(data)

		isLoading.value = false
	})
}
</script>

<template>
	<div>
		<n-h2 depth="3" class="text-center">
			{{ $t('login.signInTitle') }}
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
					clearable
					show-password-on="click"
					autocomplete="current-password"
					:minleng="6"
					:maxlength="20"
					:placeholder="$t('login.passwordPlaceholder')"
				>
					<template #password-invisible-icon>
						<icon-park-outline-preview-close-one />
					</template>
					<template #password-visible-icon>
						<icon-park-outline-preview-open />
					</template>
				</n-input>
			</n-form-item>

			<n-form-item path="captcha">
				<n-flex class="w-full flex-between flex-center">
					<n-input
						class="flex-1"
						v-model:value="form.captcha"
						clearable
						:maxlength="4"
						:placeholder="$t('login.captchaPlaceholder')"
						@keydown.enter="handleLogin()"
					/>
					<n-image
						class="w-100px h-38px ml-12px cursor-pointer"
						v-if="captchaUrl"
						:src="captchaUrl"
						:alt="$t('login.captcha')"
						@click="initCaptcha"
					/>
				</n-flex>
			</n-form-item>

			<n-space vertical :size="20">
				<div class="flex-y-center justify-between">
					<n-checkbox v-model:checked="isRemember">
						{{ $t('login.rememberMe') }}
					</n-checkbox>
					<n-button type="primary" text @click="toOtherForm('resetPasswordForm')">
						{{ $t('login.forgotPassword') }}
					</n-button>
				</div>
				<n-button
					block
					type="primary"
					size="large"
					:loading="isLoading"
					:disabled="isLoading"
					@click="handleLogin"
				>
					{{ $t('login.signIn') }}
				</n-button>
				<n-flex>
					<n-text>{{ $t('login.noAccountText') }}</n-text>
					<n-button type="primary" text @click="toOtherForm('registerForm')">
						{{ $t('login.signUp') }}
					</n-button>
				</n-flex>
			</n-space>
		</n-form>
	</div>
</template>

<style scoped></style>
