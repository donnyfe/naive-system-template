<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
import {
	checkChunk,
	getUploadId,
	getUploadProgress,
	mergeChunk,
	uploadChunk,
	uploadFile
} from '@/api/upload'
import { createChunks, promisePool } from '@/utils'
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'

const percentage = ref(0)
const uploadPercentage = ref(0)

async function handleUploadFile(file: File) {
	const {
		data: { uploadId }
	} = await getUploadId()

	const formData = new FormData()
	formData.set('file', file)
	formData.set('uploadId', uploadId)
	formData.set('name', file.name)

	uploadFile(formData, {
		isUpload: true,
		onUploadProgress: (event: ProgressEvent) => {
			uploadPercentage.value = Math.ceil((event.loaded / event.total) * 100)
		}
	})
}

async function handleUploadChunk(data: any) {
	const { hash, file, chunks } = data

	const { data: chunkList } = await checkChunk({
		hash,
		filename: file.name,
		chunkTotal: chunks.length
	})

	const requestTask: (() => Promise<any>)[] = []
	const {
		data: { uploadId }
	} = await getUploadId()

	chunks.forEach((chunk: Blob, index: number) => {
		if (!chunkList[index]) {
			// 请求任务
			const task = () => {
				const formData = new FormData()
				formData.set('file', chunk)
				formData.set('uploadId', uploadId)
				formData.set('hash', hash)
				formData.set('index', index.toString())

				return uploadChunk(formData, {
					isUpload: true,
					onUploadProgress: (event: ProgressEvent) => {
						console.log(
							`chunk(${index})上传进度:`,
							`${Math.ceil((event.loaded / event.total) * 100)}%`
						)
					}
				})
			}
			requestTask.push(task)
		}
	})

	// 轮询上传进度
	const intervalId = setInterval(async () => {
		const {
			data: { progress }
		} = await getUploadProgress({
			hash,
			totalSize: file.size
		})
		percentage.value = progress

		if (progress >= 100) {
			clearInterval(intervalId)
			$message.success('上传成功')
			return
		}
	}, 300)

	// 控制并发请求
	const maxConcurrentNum = 3
	await promisePool(requestTask, maxConcurrentNum)

	// 合并切片
	await mergeChunk({
		name: file.name,
		hash
	})
}

/**
 * 使用 Web Worker 计算文件 hash
 * @param file - 文件
 * @returns 文件 hash 和切片信息
 */
function useHashWorker(file: File) {
	return new Promise((resolve, reject) => {
		const url = new URL('./hash.worker.ts', import.meta.url)
		const worker = new Worker(url, { type: 'module' })
		// 切片大小
		const chunkSize = 1024 * 1024 * 30
		// 切片列表
		const chunks = createChunks(file, chunkSize)

		chunks.forEach((chunk, index) => {
			worker.postMessage({
				chunk,
				index,
				chunkTotal: chunks.length
			})
		})

		worker.onmessage = (e) => {
			resolve({
				...e.data,
				chunks,
				chunkSize,
				file
			})
		}

		worker.onerror = (e) => {
			reject(e)
		}
	})
}

async function onUploadChunk(options: { fileList: UploadFileInfo[] }) {
	const file = options.fileList[0].file as File
	const limitSize = 1024 * 1024 * 30 // 30MB

	// 大文件使用切片
	if (file.size > limitSize) {
		const result = await useHashWorker(file)
		handleUploadChunk(result)
	} else {
		// 小文件直接上传文件
		handleUploadFile(file)
	}
}
</script>

<template>
	<n-flex>
		<n-card title="大文件切片上传">
			<n-upload
				accept="*"
				multiple
				directory-dnd
				:max="5"
				:default-upload="false"
				@change="onUploadChunk"
			>
				<n-upload-dragger>
					<div class="mt-12px">
						<n-icon size="48" :depth="3">
							<ArchiveIcon />
						</n-icon>
					</div>
					<n-text> 点击或者拖动文件到该区域来上传 </n-text>
				</n-upload-dragger>
			</n-upload>
			<n-progress
				v-if="percentage > 0"
				type="line"
				:percentage="percentage"
				indicator-placement="inside"
			/>
		</n-card>
	</n-flex>
</template>

<style lang="scss" scoped></style>
