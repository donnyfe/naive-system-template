import { Plugin } from 'vite'
import { makeHtmlAttributes } from '@rollup/plugin-html'

interface ScriptObject {
	src: string
	attrs?: Record<string, string>
}

/**
 * @title html注入插件 (plugin: @rollup/plugin-html)
 * @description 用于向html注入数据，生成html
 * @link https://github.com/rollup/plugins/tree/master/packages/html
 */
export function useHtmlPlugin(): Plugin {
	return {
		name: 'vite:html-transform',
		transformIndexHtml(html) {
			const scripts: ScriptObject[] = [
				{
					src: 'https://cdn.bootcdn.net/ajax/libs/vue/3.5.12/vue.esm-browser.prod.min.js',
					attrs: {}
				},
				{
					src: 'https://cdn.bootcdn.net/ajax/libs/vue-router/4.4.5/vue-router.esm-browser.min.js',
					attrs: {}
				},
				{
					src: 'https://cdn.bootcdn.net/ajax/libs/naive-ui/2.39.0/index.prod.js',
					attrs: {}
				},
				{
					src: 'https://cdn.bootcdn.net/ajax/libs/vue-demi/0.14.8/index.iife.min.js',
					attrs: {}
				},
				{
					src: 'https://cdn.bootcdn.net/ajax/libs/pinia/2.2.4/pinia.iife.prod.min.js',
					attrs: {}
				},
				{
					src: 'https://cdn.bootcdn.net/ajax/libs/vue-i18n/10.0.4/vue-i18n.esm-browser.prod.min.js',
					attrs: {}
				},

				{
					src: 'https://cdn.bootcdn.net/ajax/libs/axios/1.7.7/axios.min.js',
					attrs: {}
				}
			]

			const scriptTags = scripts
				.map(({ src, attrs = {} }) => {
					attrs = {
						...attrs,
						type: 'module',
						src
					}
					return `<script${makeHtmlAttributes(attrs)}></script>`
				})
				.join('\n')
			console.log(8888888, scriptTags)

			return (
				html
					// 注入script标签
					.replace(
						'</body>',
						`${scriptTags}
						</body>`
					)
			)
		}
	}
}
