<script lang="ts" setup>
import mdKatex from '@traptitech/markdown-it-katex'
import { useClipboard } from '@vueuse/core'
import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import mila from 'markdown-it-link-attributes'
import 'highlight.js/styles/atom-one-dark.css'

interface Props {
	text?: string
	loading?: boolean
	type?: 'markdown' | 'text'
}

const props = defineProps<Props>()
const { copy } = useClipboard({})
const textRef = ref<HTMLElement>()

const mdi = new MarkdownIt({
	html: false,
	linkify: true,
	highlight(code, language) {
		const validLang = !!(language && hljs.getLanguage(language))
		if (validLang) {
			const lang = language ?? ''
			return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
		}
		return highlightBlock(hljs.highlightAuto(code).value, '')
	}
})

mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-10px', errorColor: ' #cc0000' })

const text = computed(() => {
	const value = props.text ?? ''
	if (props.type === 'markdown') return mdi.render(value)
	return value
})

function highlightBlock(str: string, lang?: string) {
	return `
		<pre class="code-block-content relative">
			<button class="code-block-header__copy absolute top-4 right-4 z-100 bg-transparent p-1 text-xs text-white">复制代码</button>
			<code class="${lang}">${str}</code>
		</pre>
	`
}

function addCopyEvents() {
	if (textRef.value) {
		const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
		copyBtn.forEach((btn) => {
			btn.addEventListener('click', () => {
				const code = btn?.nextElementSibling?.textContent
				if (code) {
					copy(code).then(() => {
						btn.textContent = '复制成功'
						setTimeout(() => {
							btn.textContent = '复制代码'
						}, 1000)
					})
				}
			})
		})
	}
}

function removeCopyEvents() {
	if (textRef.value) {
		const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
		copyBtn.forEach((btn) => {
			btn.removeEventListener('click', () => {})
		})
	}
}

onMounted(() => {
	addCopyEvents()
})

onUpdated(() => {
	addCopyEvents()
})

onUnmounted(() => {
	removeCopyEvents()
})
</script>

<template>
	<div ref="textRef" class="flex-1 w-auto max-w-full text-sm dark:prose-invert md:text-base">
		<div v-if="props.type === 'markdown'" class="prose max-w-full" v-html="text" />
		<div v-else v-text="text" />
		<span v-if="loading" class="w-4px h-20px block animate-blink" />
	</div>
</template>

<style lang="scss">
.code-block-content {
	background: rgb(40, 44, 52);
	color: rgb(171, 178, 191);
	text-shadow: rgba(0, 0, 0, 0.3) 0px 1px;
	font-family: 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
	direction: ltr;
	text-align: left;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	line-height: 1.5;
	tab-size: 0;
	hyphens: none;
	padding: 16px;
	overflow: auto;
	border-radius: 0.3em;
}
</style>
