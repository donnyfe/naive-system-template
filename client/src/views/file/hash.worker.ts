import SparkMD5 from 'spark-md5'
import { getArrayBufferFromBlobs } from './file.utils'

let chunks: Blob[] = []

self.onmessage = async (e) => {
	const { chunk, chunkTotal } = e.data

	chunks.push(chunk)

	if (chunks.length === chunkTotal) {
		console.time('Worker 计算文件Hash耗时：')
		const arrayBuffer = await getArrayBufferFromBlobs(chunks)
		const hash = SparkMD5.ArrayBuffer.hash(arrayBuffer)
		console.timeEnd('Worker 计算文件Hash耗时：')

		self.postMessage({ hash })
		self.close()
	}
}

self.onerror = (e) => {
	console.log(e)
}
