<script
	setup
	lang="ts"
>
import { ref, reactive } from 'vue'
import { useFormRules } from './hooks'
import { useAuthStore } from '@/store'
import { useThrottleFn } from '@vueuse/core'
import { encrypt } from '@/utils/aes'
import { local } from '@/utils'
import FallbackImage from '@/components/fallback-image.vue'
import { UserOutlined, LockOutlined } from '@vicons/antd'

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const authStore = useAuthStore()

const formRef = ref()
const loading = ref(false)

const form = reactive({
	username: 'admin01',
	password: '123456',
	captcha: ''
})
const rules = useFormRules(form) as Ref<Record<string, any[]>>

// 验证码相关
const captchaUrl = ref('')
const baseUrl = import.meta.env.VITE_AXIOS_BASE_URL || ''
const fetchCaptcha = useThrottleFn(() => {
	captchaUrl.value = `${baseUrl}/api/auth/captcha?${Date.now()}`
}, 500)

// 记住密码
const isRemember = ref(false)

// 表单提交
async function handleSubmit() {
	try {
		await formRef.value?.validate()
		loading.value = true

		const { username, password } = form
		if (isRemember.value) {
			local.set('loginAccount', {
				username,
				password: encrypt(password)
			})
		}

		const res = await authStore.login({
			...form,
			password: encrypt(password)
		})

		if (!res.success) {
			fetchCaptcha()
		}
	} catch (error) {
		fetchCaptcha()
	} finally {
		loading.value = false
	}
}

// 切换表单
function switchForm(type: string) {
	emit('update:modelValue', type)
}

onMounted(() => {
	fetchCaptcha()
})
</script>

<template>
<div class="login-form login-modal-form">
	<n-h2 class="form-title">
		{{ $t('login.signInTitle') }}
	</n-h2>
	<n-form
		ref="formRef"
		:model="form"
		:rules="rules"
		size="large"
	>
		<n-form-item path="username">
			<n-input
				v-model:value="form.username"
				:placeholder="t('login.accountPlaceholder')"
			>
				<template #prefix>
					<n-icon>
						<UserOutlined />
					</n-icon>
				</template>
			</n-input>
		</n-form-item>

		<n-form-item path="password">
			<n-input
				v-model:value="form.password"
				type="password"
				show-password-on="click"
				:placeholder="t('login.passwordPlaceholder')"
			>
				<template #prefix>
					<n-icon>
						<LockOutlined />
					</n-icon>
				</template>
			</n-input>
		</n-form-item>

		<n-form-item path="captcha">
			<div class="w-full h-full flex flex-row justify-between items-center">
				<n-input
					class="flex-1"
					v-model:value="form.captcha"
					:placeholder="t('login.captchaPlaceholder')"
					@keyup.enter="handleSubmit"
				/>
				<div class="w-28 h-full items-center ml-4">
					<FallbackImage
						class="w-full h-full max-h-44px rounded cursor-pointer"
						:src="captchaUrl"
						:alt="t('login.captcha')"
						@click="fetchCaptcha"
					/>
				</div>
			</div>
		</n-form-item>

		<div class="flex justify-between mb-4 text-white flex-center">
			<n-checkbox v-model:checked="isRemember">
				<span class="text-white">{{ t('login.rememberMe') }}</span>
			</n-checkbox>
			<n-button
				text
				class="text-white"
				@click="switchForm('resetPasswordForm')"
			>
				{{ t('login.forgotPassword') }}
			</n-button>
		</div>

		<n-button
			class="text-white rounded-lg"
			block
			type="primary"
			size="large"
			:loading="loading"
			@click="handleSubmit"
		>
			{{ t('login.signIn') }}
		</n-button>

		<div class="mt-4 text-center text-white">
			{{ t('login.noAccountText') }}
			<n-button
				text
				:class="['text-[var(--n-text-color-pressed)]']"
				@click="switchForm('registerForm')"
			>
				{{ t('login.signUp') }}
					</n-button>
				</div>
				</n-form>
	</div>
</template>

<style
	lang="scss"
	scoped
>
	@use '../style.scss' as *;

	.captcha-img {
		@apply w-28 h-full cursor-pointer ml-4 rounded;
	}
</style>
