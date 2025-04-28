<script
	setup
	lang="ts"
>
import { ref, reactive, onUnmounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { UserOutlined, LockOutlined, NumberOutlined } from '@vicons/antd'
import { useAuthStore } from '@/store'
import { useFormRules } from './hooks'

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const authStore = useAuthStore()

const formRef = ref()
const loading = ref(false)
const isRead = ref(false)

const form = reactive({
	email: '',
	password: '',
	captcha: ''
})
const rules = useFormRules(form) as Ref<Record<string, any[]>>

const countdown = ref(0)
const timer = ref<number>()

async function handleSubmit() {
	if (!isRead.value) {
		$message.warning(t('login.agreementRequired'))
		return
	}

	try {
		await formRef.value.validate()
		loading.value = true

		const { email, password } = form
		const res = await authStore.register(email, password)

		if (res.success) {
			$message.success(t('login.registerSuccess'))
			switchForm('loginForm')
		}
	} finally {
		loading.value = false
	}
}

function switchForm(type: string) {
	emit('update:modelValue', type)
}

const getCaptcha = useDebounceFn(async () => {
	if (countdown.value > 0) return
	try {
		await formRef.value.validate(
			(errors: any) => { },
			(fields: any) => fields.key === 'email'
		)

		$message.success(t('login.captchaSent'))

		countdown.value = 60
		timer.value = setInterval(() => {
			countdown.value--
			if (countdown.value <= 0) {
				clearInterval(timer.value)
			}
		}, 1000) as unknown as number

		await authStore.getVerifyCode({
			email: form.email
		})

	} catch (err) {
		$message.error(t('login.emailFormatTip'))
	}
}, 2000)

onUnmounted(() => {
	if (timer.value) {
		clearInterval(timer.value)
	}
})
</script>

<template>
<div class="register-form form-wrapper">
	<n-h1 class="form-title">
		{{ t('login.registerTitle') }}
	</n-h1>

	<n-form
		ref="formRef"
		:model="form"
		:rules="rules"
		size="large"
	>
		<n-form-item path="email">
			<n-input
				class="form-input"
				v-model:value="form.email"
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
				class="form-input"
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
					class="flex-1 form-input"
					v-model:value="form.captcha"
					:placeholder="t('login.captchaPlaceholder')"
					:maxlength="6"
				>
					<template #prefix>
						<n-icon>
							<NumberOutlined />
						</n-icon>
					</template>
				</n-input>

				<div class="w-120px h-full items-center ml-4 h-8">
					<n-button
						class="captcha-button"
						type="primary"
						:disabled="countdown > 0"
						:loading="countdown > 0"
						@click="getCaptcha"
					>
						{{ countdown > 0 ? `${countdown}s` : t('login.getCaptcha') }}
					</n-button>
				</div>
			</div>
		</n-form-item>

		<n-button
			class="text-white rounded-lg mt-6"
			block
			type="primary"
			size="large"
			:loading="loading"
			@click="handleSubmit"
		>
			{{ t('login.signUp') }}
		</n-button>

		<div class="flex justify-between pt-2">
			<n-checkbox
				v-model:checked="isRead"
				class="pb-1 items-center"
			>
				<span class="">{{ t('login.readAndAgree') }}</span>
				<n-text
					text
					:class="['text-[var(--n-text-color-pressed)]']"
				>《{{ t('login.userAgreement') }}》</n-text>
			</n-checkbox>

			<div class="text-right">
				{{ t('login.haveAccountText') }}
				<n-text
					text
					:class="['text-[var(--n-text-color-pressed)]']"
					@click="switchForm('loginForm')"
				>
					{{ t('login.signIn') }}
				</n-text>
			</div>
		</div>

	</n-form>
	</div>
</template>

<style lang="scss" scoped>
@use '../style.scss' as *;

.captcha-button {
	@apply w-120px h-40px dark:text-white;
}

.form-footer {
	@apply flex justify-between pt-2;
}

.agreement-checkbox {
	@apply pb-1 items-center;
}
</style>

