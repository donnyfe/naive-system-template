<script setup lang="ts">
import type { IFormType } from './types'
import { useAppStore } from '@/store'
import LoginForm from './components/login-form.vue'
import RegisterForm from './components/register-form.vue'
import ResetPasswordForm from './components/reset-password-form.vue'

const { theme } = useAppStore()
const primaryColor = theme?.common?.primaryColor

const formType: Ref<IFormType> = ref('loginForm')

const formComponets = {
	loginForm: LoginForm,
	registerForm: RegisterForm,
	resetPasswordForm: ResetPasswordForm
}
</script>

<template>
	<n-el ref="loginWrapper" class="wh-full flex-center dark:bg-dark" :style="{ background: primaryColor }">
		<div class="fixed top-40px right-40px text-lg flex flex-start">
			<DarkModeSwitch />
			<LangsSwitch />
		</div>
		<n-el class="p-2xl h-full w-full sm:w-450px sm:h-600px bg-[var(--card-color)] shadow-[var(--box-shadow-1)]">
			<div class="w-full flex flex-col items-center">
				<transition name="fade-slide" mode="out-in">
					<component :is="formComponets[formType]" v-model="formType" class="w-85%" />
				</transition>
			</div>
		</n-el>

		<div />
	</n-el>
</template>
