import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { useIconsPlugin, useAutoImportPlugin, useResolverPlugin } from './plugins'

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
	resolve: {
		alias: {
			'@': resolve('./src')
		}
	},
})
