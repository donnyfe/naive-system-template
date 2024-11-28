import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useFormRules(formModel?: { password: string }) {
	const { t } = useI18n()

	return computed(() => ({
		email: [
			{ key: 'email', required: true, message: t('login.emailRuleTip') },
			{ key: 'email', type: 'email', message: t('login.emailFormatTip') }
		],
		password: [
			{ required: true, message: t('login.passwordRuleTip') },
			{ min: 6, max: 20, message: t('login.passwordLengthTip') }
		],
		captcha: [
			{ required: true, message: t('login.captchaRuleTip') },
			{ len: 4, message: t('login.captchaLengthTip') }
		],
		checkPassword: [
			{ required: true, message: t('login.checkPasswordRuleTip') },
			{
				validator: (rule: any, value: string) => {
					return new Promise((resolve, reject) => {
						if (value === formModel?.password) {
							resolve(void 0)
						} else {
							reject(t('login.passwordNotMatch'))
						}
					})
				}
			}
		]
	}))
}
