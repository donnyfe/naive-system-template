<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import { env, pipeline } from '@xenova/transformers'

env.allowLocalModels = false

const imageContaienr = ref()
const status = ref()

// 检测图片AI任务
async function detect(image: HTMLImageElement) {
	status.value.textContent = '分析中...'

	const detector = await pipeline('object-detection', 'Xenova/detr-resnet-50') // model 图片对象检测

	console.time('图像识别耗时:')
	const output = await detector(image.src, {
		threshold: 0.1,
		percentage: true
	})
	status.value.textContent = '分析完成！'

	console.log('output: ', output)
	console.timeEnd('图像识别耗时:')
	output.forEach((item: any) => renderBox(item))
}

// 输出渲染函数
function renderBox({ box, label }: { box: any; label: any }) {
	// 从 `box` 对象中解构出最大和最小的 x 和 y 坐标值，便于对各个检测结果对象添加边框
	const { xmax, xmin, ymax, ymin } = box
	// 用于表示边界框
	const boxElement = document.createElement('div')
	// 添加一个 CSS 类名，用于样式控制
	boxElement.className = 'bounding-box'
	Object.assign(boxElement.style, {
		position: 'absolute',
		left: `${100 * xmin}%`,
		top: `${100 * ymin}%`,
		width: `${100 * (xmax - xmin)}%`,
		height: `${100 * (ymax - ymin)}%`,
		borderWidth: '1px',
		borderStyle: 'solid',
		borderColor: '#FF0000'
	})
	// 显示在页面上
	imageContaienr.value.appendChild(boxElement)
	// 显示标签文本
	const labelElement = document.createElement('span')
	labelElement.textContent = label
	labelElement.className = 'bounding-box-label'
	// 设置标签文本的背景颜色为黑红色。
	labelElement.style.backgroundColor = '#FF0000'
	// 显示标签
	boxElement.appendChild(labelElement)
	imageContaienr.value.appendChild(boxElement)
}

async function onUploadFile(options: { fileList: UploadFileInfo[] }) {
	const file = options.fileList[0].file as File

	try {
		const dataUrl = await readFileAsDataURL(file)
		const image = new Image()
		image.src = dataUrl
		image.onload = () => {
			imageContaienr.value.appendChild(image)
			detect(image)
		}
	} catch (error) {
		console.error('Error reading file:', error)
	}
}

function readFileAsDataURL(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = (event) => resolve(event.target?.result as string)
		reader.onerror = (error) => reject(error)
		reader.readAsDataURL(file)
	})
}
</script>

<template>
	<n-flex>
		<n-card title="示例">
			<div ref="imageContaienr" class="img-container" />
			<p ref="status" class="status" />
		</n-card>
		<n-card title="图像上传">
			<n-upload multiple directory-dnd :max="5" :default-upload="false" @change="onUploadFile">
				<n-upload-dragger>
					<div class="mt-12px">
						<n-icon size="48" :depth="3">
							<ArchiveIcon />
						</n-icon>
					</div>
					<n-text> 点击或者拖动文件到该区域来上传 </n-text>
				</n-upload-dragger>
			</n-upload>
		</n-card>
	</n-flex>
</template>

<style lang="scss" scoped>
.img-container {
	position: relative;
	width: 100%;

	img {
		width: 100%;
	}
	.bounding-box {
		position: absolute;
		box-sizing: border-box;
	}

	.bounding-box-label {
		position: absolute;
		font-size: 12px;
	}
}
</style>
