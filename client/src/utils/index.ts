export * from './array'
export * from './file'
export * from './i18n'
export * from './icon'
export * from './request'
export * from './storage'

export async function copyToClip(text: string) {
	return new Promise((resolve, reject) => {
		try {
			const input: HTMLTextAreaElement = document.createElement('textarea')
			input.setAttribute('readonly', 'readonly')
			input.value = text
			document.body.appendChild(input)
			input.select()
			if (document.execCommand('copy'))
				document.execCommand('copy')
			document.body.removeChild(input)
			resolve(text)
		}
		catch (error) {
			reject(error)
		}
	})
}

/** 获取客户端线程数量， 返回用户设备的逻辑处理器内核数 */
export const getConcurrency = () => navigator.hardwareConcurrency || 4
