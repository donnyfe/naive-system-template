import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { useAutoImportPlugin, useIconsPlugin, useResolverPlugin } from './plugins'

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	plugins: [
		vue(),
		vueJsx(),
		UnoCSS({
			configFile: resolve('src/unocss.config.ts')
		}),
		useIconsPlugin(),
		useAutoImportPlugin(),
		useResolverPlugin()
	],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler' // or 'modern'
			}
		}
	},
	resolve: {
		alias: {
			'@': resolve('./src')
		}
	}
})
