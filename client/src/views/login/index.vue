<script setup lang="ts">
import type { IFormType } from './types'
import LoginForm from './components/login-form.vue'
import RegisterForm from './components/register-form.vue'
import ResetPasswordForm from './components/reset-password-form.vue'

const formType = ref<IFormType>('loginForm')

const formComponents = {
	loginForm: LoginForm,
	registerForm: RegisterForm,
	resetPasswordForm: ResetPasswordForm
}
</script>

<template>
	<div class="login-container">
		<!-- 左侧品牌区域 -->
		<div class="login-banner">
			<div class="banner-content">
				<h1 class="text-2xl font-bold mb-4">欢迎使用</h1>
				<!-- <p class="text-lg opacity-75">打造专业的企业级应用</p> -->
			</div>
		</div>
	
		<!-- 右侧表单区域 -->
		<div class="login-form-container">
			<div class="form-header">
				<DarkModeSwitch />
				<LangsSwitch />
			</div>
	
			<div class="form-content">
				<transition
					name="fade-slide"
					mode="out-in"
				>
					<component
						:is="formComponents[formType]"
						v-model="formType"
						class="w-85%"
					/>
				</transition>
			</div>
		</div>
	</div>

</template>

<style scoped>
	.login-container {
		@apply w-full min-h-screen flex;
		background: linear-gradient(135deg, #fff 0%, #000 100%);
	}

	.login-banner {
		@apply hidden lg:flex flex-1 bg-primary items-center justify-center;
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-hover) 100%);
	}

	.banner-content {
		@apply text-white text-center p-8;
	}

	.login-form-container {
		@apply w-full lg:w-500px bg-white dark:bg-dark flex flex-col;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
	}

	.form-header {
		@apply flex justify-end p-4 gap-2;
	}

	.form-content {
		@apply flex-1 flex items-center justify-center p-8;
	}

	.fade-slide-enter-active,
	.fade-slide-leave-active {
		transition: all 0.3s ease;
	}

	.fade-slide-enter-from,
	.fade-slide-leave-to {
		opacity: 0;
		transform: translateX(20px);
	}
</style>
