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
<div class="login-form form-wrapper">
	<n-h1 class="form-title">
		{{ $t('login.signInTitle') }}
	</n-h1>

  <n-form ref="formRef" :model="form" :rules="rules" size="large">
    <n-form-item path="email" class="form-item">
      <n-input
        v-model:value="form.email"
        autocomplete="email"
        clearable
        :placeholder="t('login.emailPlaceholder')"
        class="form-input"
      >
        <template #prefix>
          <n-icon class="input-icon">
            <UserOutlined />
          </n-icon>
        </template>
      </n-input>
    </n-form-item>

    <n-form-item path="password" class="form-item">
      <n-input
        v-model:value="form.password"
        type="password"
        autocomplete="current-password"
        show-password-on="click"
        clearable
        :placeholder="t('login.passwordPlaceholder')"
        class="form-input"
      >
        <template #prefix>
          <n-icon class="input-icon">
            <LockOutlined />
          </n-icon>
        </template>
      </n-input>
    </n-form-item>

    <n-form-item path="captcha" class="form-item">
      <div class="captcha-container">
        <n-input
          class="captcha-input form-input flex-1"
          v-model:value="form.captcha"
          clearable
          :placeholder="t('login.captchaPlaceholder')"
          @keyup.enter="handleSubmit"
        />
        <div class="captcha-image-wrapper">
          <FallbackImage
            class="captcha-image"
            :src="captchaUrl"
            :alt="t('login.captcha')"
            @click="fetchCaptcha"
          />
        </div>
      </div>
    </n-form-item>

    <div class="remember-container">
      <n-checkbox v-model:checked="isRemember">
        <span class="checkbox-text">{{ t('login.rememberMe') }}</span>
      </n-checkbox>
    </div>

    <div class="form-footer">
      <n-button
        class="submit-btn"
        type="primary"
        block
        size="large"
        :loading="loading"
        @click="handleSubmit"
      >
        {{ t('login.signIn') }}
      </n-button>

      <div class="flex flex-justify-between pt-0">
        <div class="text-left">
          {{ t('login.noAccountText') }}
          <n-button text @click="switchForm('registerForm')">
            {{ t('login.signUp') }}
          </n-button>
        </div>
        <n-button
          text
          class="forgot-password"
          @click="switchForm('resetPasswordForm')"
        >
          {{ t('login.forgotPassword') }}
        </n-button>
      </div>
    </div>
  </n-form>
</div>
</template>

<style lang="scss" scoped>
@use '../style.scss' as *;

.remember-container {
	@apply pt-6 pb-2;
}

.form-footer {
	@apply flex flex-col gap-2;
}

.captcha-container {
	@apply flex items-center gap-2;
}

.captcha-image-wrapper {
	@apply flex-shrink-0;
}

.captcha-image {
	@apply w-24 h-10 cursor-pointer;
}
</style>
