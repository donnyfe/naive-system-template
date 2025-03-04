<script
	setup
	lang="ts"
>
import { ref, reactive } from 'vue'
import { useFormRules } from './hooks'
import { useAuthStore } from '@/store'
import { useThrottleFn } from '@vueuse/core'
import { encrypt, decrypt } from '@/utils/aes'
import { local } from '@/utils'
import FallbackImage from '@/components/fallback-image.vue'
import { UserOutlined, LockOutlined } from '@vicons/antd'

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const authStore = useAuthStore()

const formRef = ref()
const loading = ref(false)

const form = reactive({
	email: '',
	password: '',
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

		const { email, password } = form

		// 增加安全性检查
		if (isRemember.value && email && password) {
			// 使用更安全的加密方式
			const encryptedPassword = encrypt(password)
			local.set('loginAccount', {
				email,
				password: encryptedPassword,
				timestamp: Date.now() // 添加时间戳用于验证
			})
		}

		const res = await authStore.login({
			email,
			password: encrypt(password),
			captcha: form.captcha
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

	// 读取保存的账号信息
	const savedAccount = local.get('loginAccount')

	if (savedAccount?.email && savedAccount?.password) {
		const DAYS = 7 * 24 * 60 * 60 * 1000
		const isExpired = savedAccount?.timestamp && Date.now() - savedAccount.timestamp > DAYS

		if (!isExpired) {
			form.email = savedAccount.email
			form.password = decrypt(savedAccount.password) // 解密密码
			isRemember.value = true
		}
	}
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
		<n-form-item path="email">
			<n-input
				v-model:value="form.email"
				autocomplete="email"
				clearable
				:placeholder="t('login.emailPlaceholder')"
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
				autocomplete="current-password"
				show-password-on="click"
				clearable
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
					clearable
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
			<!-- <n-button
				text
				class="text-white"
				@click="switchForm('resetPasswordForm')"
			>
				{{ t('login.forgotPassword') }}
			</n-button> -->
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
