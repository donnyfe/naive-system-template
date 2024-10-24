import globals from 'globals'
// eslint.config.js
import antfu from '@antfu/eslint-config'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

// https://github.com/antfu/eslint-config
// https://www.npmjs.com/package/@antfu/eslint-config
export default await antfu(
	{
		// 启用 TypeScript 支持
		typescript: {
			tsconfigPath: './tsconfig.json'
		},
		// 启用 Vue 支持
		vue: true,
		// 启用样式规则
		stylistic: {
			indent: 'tab', // 4, or 'tab'
			quotes: 'single', // or 'double'
			semi: 'never',
			trailingComma: 'none'
		},
		// 启用 JSON 支持
		jsonc: true,
		// 启用 YAML 支持
		yaml: true,
		// 启用 Markdown 支持
		markdown: true,
		ignore: ['**/*.md']
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2022
			}
		}
	},
	{
		...tseslint.configs.recommended
	},
	{
		// 针对 JavaScript 和 TypeScript 文件的配置
		files: ['**/*.{js,jsx,ts,tsx}'],
		rules: {}
	},
	{
		...pluginVue.configs['flat/vue3-recommended']
	},
	{
		// 针对Vue 文件的配置
		files: ['**/*.vue'],
		languageOptions: {
			// parser: pluginVue.parser
			parserOptions: {
				parser: tseslint.parser
			}
		},
		rules: {
			'vue/operator-linebreak': ['error', 'before'],
			'vue/multi-word-component-names': 'off',
			'vue/html-indent': ['error', 'tab'] // 保持与其他文件一致的缩进
		}
	},
	{
		// 通用规则
		rules: {
			'style/indent': ['error', 'tab'],
			'style/no-tabs': ['off'],
			'style/quotes': ['error', 'single'],
			'style/semi': ['error', 'never'],
			'style/comma-dangle': ['error', 'never'],
			'no-console': ['warn'],
			// 关闭多行属性分隔符，一般用于类成员属性定义和ts接口定义中
			'style/member-delimiter-style': [
				'off',
				{
					multiline: {
						delimiter: 'semi',
						requireLast: true
					},
					singleline: {
						delimiter: 'semi',
						requireLast: false
					},
					multilineDetection: 'brackets'
				}
			],
			'no-console': ['warn', 'never'],
			'no-debugger': ['error', 'never'],
			'no-unused-vars': ['error', 'never']
		}
	}
)
