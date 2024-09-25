/**
 * 创建切片
 * @param file
 * @returns
 */
export const createChunks = function (file: File, chunkSize: number): Blob[] {
	const chunks: Blob[] = []
	const fileSize = file.size
	let start = 0
	while (start < fileSize) {
		const chunk = file.slice(start, start + chunkSize)
		chunks.push(chunk)
		start += chunkSize
	}
	return chunks
}

/** 获取客户端线程数量， 返回用户设备的逻辑处理器内核数 */
export const getConcurrency = () => navigator.hardwareConcurrency || 4

/**
 * Blob转ArrayBuffer
 * @param chunks
 */
export const getArrayBufferFromBlobs = (chunks: Blob[]): Promise<ArrayBuffer[]> => {
	return Promise.all(chunks.map((chunk) => chunk.arrayBuffer()))
}

/**
 * Promise并发控制
 * @param fns
 * @param limit
 * @returns
 */
export const promisePool = async function (fns: Function[], limit: number) {
	let index = 0
	let results: Promise<any>[] = []

	const requestList = [...new Array(limit)].map(async () => {
		while (index < fns.length) {
			const currentIndex = index
			index++
			try {
				results[currentIndex] = await fns[currentIndex]()
			} catch (error: any) {
				throw new Error(error)
			}
		}
	})
	await Promise.all(requestList)

	return results
}

/**
 * Promise串行执行
 * @param fns
 * @returns
 */
export const inOrderPromise = function (fns: Function[]) {
	const res = []
	return new Promise((resolve) => {
		fns
			.reduce((pre, cur) => {
				return pre.then(cur).then((data) => {
					res.push(data)
					console.log(res)
				})
			}, Promise.resolve())
			.then(() => resolve(res))
	})
}
