import { getArrayBufferFromBlobs } from '@/utils'
import SparkMD5 from 'spark-md5'

const chunks: Blob[] = []

self.onmessage = async (e) => {
	const { chunk, chunkTotal } = e.data
	chunks.push(chunk)

	if (chunks.length === chunkTotal) {
		console.time('Worker 计算文件Hash耗时：')
		const arrayBuffer = await getArrayBufferFromBlobs(chunks)
		// @ts-ignore
		const hash = SparkMD5.ArrayBuffer.hash(arrayBuffer)
		console.timeEnd('Worker 计算文件Hash耗时：')

		self.postMessage({ hash })
		self.close()
	}
}

self.onerror = (e) => {
	console.log(e)
}
