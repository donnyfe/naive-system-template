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
	<div class="login__background">
		<div class="login__particles"></div>
		<div class="login__gradient"></div>
		<div class="login__shapes">
			<div class="login__shape login__shape--1"></div>
			<div class="login__shape login__shape--2"></div>
			<div class="login__shape login__shape--3"></div>
		</div>
	</div>

	<!-- 顶部导航 -->
	<div class="login__header">
		<div class="login__logo">
			<img src="./logo.svg" alt="Logo" class="h-8" />
			<span class="ml-2 text-xl font-semibold">Admin System</span>
		</div>
		<div class="login__actions">
			<DarkModeSwitch />
			<LangsSwitch />
		</div>
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

	<footer class="login__footer">
		<p>网站正在建设中</p>
		<p class="login__copyright">&copy; 2025 Admin System</p>
	</footer>
</div>
</template>

<style
	lang="scss"
	scoped
>
	.login {
		@apply
			w-full min-h-screen relative
			flex flex-col items-center justify-center
			overflow-hidden;

		&__background {
			@apply fixed inset-0 z-0 dark:bg-black;

			.login__particles {
				@apply absolute inset-0;
				/* background-image: radial-gradient(circle, rgba(148, 163, 184, 0.1) 1px, transparent 1px); */
				background-size: 30px 30px;
				opacity: 0.5;
				animation: particles 120s linear infinite;
			}

			.login__gradient {
				@apply absolute inset-0;
				background: radial-gradient(circle at 50% 30%,
						rgba(255, 255, 255, 0.8) 0%,
						rgba(241, 245, 249, 0.3) 100%);
			}

			.login__shapes {
				@apply absolute inset-0 overflow-hidden;

				.login__shape {
					@apply absolute rounded-full opacity-20 blur-xl;

					&--1 {
						width: 300px;
						height: 300px;
						background: linear-gradient(45deg, #3b82f6, #8b5cf6);
						top: 10%;
						left: -100px;
						animation: float1 25s ease-in-out infinite alternate;
					}

					&--2 {
						width: 400px;
						height: 400px;
						background: linear-gradient(45deg, #10b981, #3b82f6);
						bottom: -150px;
						right: -100px;
						animation: float2 30s ease-in-out infinite alternate;
					}

					&--3 {
						width: 200px;
						height: 200px;
						background: linear-gradient(45deg, #f59e0b, #ef4444);
						top: 60%;
						right: 20%;
						animation: float3 20s ease-in-out infinite alternate;
					}
				}
			}
		}

		&__header {
			@apply fixed top-0 left-0 right-0 z-10
				flex justify-between items-center px-8 py-5
				bg-white
				dark:bg-dark
				dark:text-white;
			border-bottom: 1px solid rgba(148, 163, 184, 0.1);
			box-shadow: 0 4px 30px rgba(148, 163, 184, 0.1);
		}

		&__logo {
			@apply flex items-center;

			img {
				filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.3));
				transition: all 0.3s ease;

				&:hover {
					filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.5));
				}
			}

			span {
				@apply text-dark dark:text-white;
				text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
			}
		}

		&__actions {
			@apply flex items-center gap-6;
		}

		&__form-wrapper {
			@apply relative z-10 w-full flex justify-center items-center py-16;
			perspective: 1000px;
		}

		&__container {
			@apply rounded-xl overflow-hidden bg-white dark:bg-dark;
			width: 420px;

			@media (max-width: 768px) {
				@apply w-[92%] min-h-[450px] mx-4 p-6;
				max-width: none;
				transform: none;

				&:hover {
					transform: none;
				}
			}

			@media (max-width: 480px) {
				@apply min-h-[420px] p-5;
			}
		}

		&__content {
			@apply h-full flex flex-col justify-center;
		}

		&__form {
			@apply w-full;
		}

		&__footer {
			@apply fixed bottom-0 left-0 right-0 z-10 py-4 text-center text-slate-800 text-sm dark:bg-dark dark:text-slate-200
			dark:bg-dark bg-white;
			border-top: 1px solid rgba(148, 163, 184, 0.1);
			box-shadow: 0 -4px 30px rgba(148, 163, 184, 0.1);
		}

		&__copyright {
			@apply mt-1 text-xs text-slate-800 dark:text-slate-200;
			letter-spacing: 0.5px;
		}
	}

	@keyframes particles {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-30px);
		}
	}

	@keyframes borderGlow {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	@keyframes float1 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(50px, 30px);
		}
	}

	@keyframes float2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(-40px, -60px);
		}
	}

	@keyframes float3 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(30px, -40px);
		}
	}

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
