<script
	setup
	lang="ts"
>
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
<div class="login">
	<!-- 背景动画 -->
	<div class="login__background">
		<div class="login__particles"></div>
		<div class="login__gradient"></div>
	</div>
	<div class="login__header">
		<DarkModeSwitch />
		<LangsSwitch />
	</div>

	<!-- 登录表单容器 -->
	<div class="login__form-wrapper">
		<div class="login__container">
			<div class="login__content">
				<transition
					name="fade-slide"
					mode="out-in"
				>
					<component
						:is="formComponents[formType]"
						v-model="formType"
						class="login__form"
					/>
				</transition>
			</div>
		</div>
	</div>

	<footer class="fixed bottom-0 w-full py-2 text-center text-white">
		网站正在建设中...
	</footer>
	</div>
</template>

<style
	lang="scss"
	scoped
>
	.login {
		@apply w-full min-h-screen relative flex items-center justify-center overflow-hidden;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);

		&__background {
			@apply fixed inset-0;

			.login__particles {
				@apply absolute inset-0;
				/* background-image: radial-gradient(circle, #ffffff 1px, transparent 1px);
				background-size: 50px 50px;
				opacity: 0.2; */
				/* animation: particles 15s linear infinite; */
			}

			.login__gradient {
				@apply absolute inset-0;
				background: radial-gradient(circle at 50% 50%,
						rgba(255, 255, 255, 0.1) 0%,
						rgba(0, 0, 0, 0.3) 100%);
			}
		}

		&__header {
			@apply absolute top-10px right-10px flex flex-row text-white;
		}

		&__container {
			@apply relative w-full max-w-md mx-auto p-8 rounded-2xl;
			background: rgba(255, 255, 255, 0.05);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(255, 255, 255, 0.1);
			box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);

			min-height: 520px;
			width: 420px;


			&__content {
				@apply h-full flex flex-col justify-center;
				min-height: inherit;
			}

			.dark & {
				background: rgba(17, 25, 40, 0.75);
				border-color: rgba(255, 255, 255, 0.06);
			}

			@media (max-width: 768px) {
				@apply w-[92%] min-h-[480px] mx-4 p-6;
				max-width: none;
			}

			@media (max-width: 480px) {
				@apply min-h-[450px] p-4;
			}
		}

		&__form {
			@apply w-full;
		}
	}

	/** 背景粒子匀速流动动画 */
	/* @keyframes particles {
		0% {
			transform: translateY(0);
		}

		100% {
			transform: translateY(-50px);
		}
	}
	*/

	.fade-slide-enter-active,
	.fade-slide-leave-active {
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.fade-slide-enter-from,
	.fade-slide-leave-to {
		opacity: 0;
		transform: translateY(10px);
	}
</style>
