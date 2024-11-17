<script
	setup
	lang="ts"
>
import { ref, reactive } from 'vue'
import { useFormRules } from './hooks'
import { useAuthStore } from '@/store'
import { UserOutlined, LockOutlined } from '@vicons/antd'

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const authStore = useAuthStore()

const formRef = ref()
const loading = ref(false)
const isRead = ref(false)

const form = reactive({
	username: '',
	password: '',
	checkPassword: ''
})
const rules = useFormRules(form) as Ref<Record<string, any[]>>

async function handleSubmit() {
	if (!isRead.value) {
		window.$message.warning(t('login.agreementRequired'))
		return
	}

	try {
		await formRef.value?.validate()
		loading.value = true

		const { username, password } = form
		const res = await authStore.register(username, password)

		if (res.success) {
			window.$message.success(t('login.registerSuccess'))
			switchForm('loginForm')
		}
	} finally {
		loading.value = false
	}
}

function switchForm(type: string) {
	emit('update:modelValue', type)
}
</script>

<template>
<div class="register-form login-modal-form">
	<n-h2 class="form-title">
		{{ t('login.registerTitle') }}
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
	
		<n-form-item path="checkPassword">
			<n-input
				v-model:value="form.checkPassword"
				type="password"
				show-password-on="click"
				:placeholder="t('login.checkPasswordPlaceholder')"
			>
				<template #prefix>
					<n-icon>
						<LockOutlined />
					</n-icon>
				</template>
			</n-input>
		</n-form-item>
	
		<n-checkbox
			v-model:checked="isRead"
			class="mb-4 items-center"
		>
			<span class="text-white">{{ t('login.readAndAgree') }}</span>
			<n-button
				text
				:class="['text-[var(--n-text-color-pressed)]']"
			>{{ t('login.userAgreement') }}</n-button>
		</n-checkbox>
		<n-button
			class="text-white rounded-lg"
			block
			type="primary"
			size="large"
			:loading="loading"
			@click="handleSubmit"
		>
			{{ t('login.signUp') }}
		</n-button>
	
		<div class="mt-4 text-center text-white">
			{{ t('login.haveAccountText') }}
			<n-button
				text
				:class="['text-[var(--n-text-color-pressed)]']"
				@click="switchForm('loginForm')"
			>
				{{ t('login.signIn') }}
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
</style>
