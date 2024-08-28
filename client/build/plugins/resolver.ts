import { resolve } from 'node:path'
/**
 * If you use the template method for development, you can use the unplugin-vue-components plugin to enable on-demand loading support.
 * 按需引入
 * https://github.com/antfu/unplugin-vue-components
*/
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'


export function useAutoImportPlugin() {
	return AutoImport({
    // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
    imports: [
      'vue',
      'vue-router',
      'pinia',
      '@vueuse/core',
      'vue-i18n',
      {
        'naive-ui': [
          'useDialog',
          'useMessage',
          'useNotification',
          'useLoadingBar',
          'useModal',
        ],
      },
    ],
    include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
		dts: resolve('src/types/auto-imports.d.ts'),
  })
}

export function useResolverPlugin() {
	// auto import components lib
  return Components({
    resolvers: [
      IconsResolver({
        prefix: false,
        customCollections: ['svg-icons'],
      }),
      NaiveUiResolver(),
    ],
		dts: resolve('src/types/components.d.ts'),
  })
}
