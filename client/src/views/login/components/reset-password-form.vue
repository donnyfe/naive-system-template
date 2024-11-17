<script
	setup
	lang="ts"
>
import { ref, reactive } from 'vue'
import { useFormRules } from './hooks'
import { UserOutlined, MailOutlined } from '@vicons/antd'

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()


const formRef = ref()
const loading = ref(false)

const form = reactive({
	username: '',
	email: ''
})
const rules = useFormRules() as Record<string, any>

async function handleSubmit() {
	try {
		await formRef.value?.validate()
		loading.value = true

		// TODO: 实现重置密码逻辑
		await new Promise(resolve => setTimeout(resolve, 1000))

		window.$message.success(t('login.resetPasswordSuccess'))
		switchForm('loginForm')
	} finally {
		loading.value = false
	}
}

function switchForm(type: string) {
	emit('update:modelValue', type)
}
</script>

<template>
<div class="reset-form login-modal-form">
	<n-h2 class="form-title">
		{{ t('login.resetPasswordTitle') }}
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
				:placeholder="t('login.resetPasswordPlaceholder')"
			>
				<template #prefix>
					<n-icon>
						<UserOutlined />
					</n-icon>
				</template>
			</n-input>
		</n-form-item>
	
		<n-form-item path="email">
			<n-input
				v-model:value="form.email"
				:placeholder="t('login.emailPlaceholder')"
			>
				<template #prefix>
					<n-icon>
						<MailOutlined />
					</n-icon>
				</template>
			</n-input>
		</n-form-item>
		<n-button
			block
			type="primary"
			size="large"
			:loading="loading"
			class="text-white rounded-lg mt-6"
			@click="handleSubmit"
		>
			{{ t('login.resetPassword') }}
		</n-button>
		<div class="mt-4 text-center">
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
