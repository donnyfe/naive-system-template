<script setup lang="ts">

interface WatermarkProps {
	visible?: boolean // 更语义化的命名
	content: string  // 必填项
	opacity?: number // 添加透明度配置
	fontSize?: number // 字体大小
	rotate?: number // 旋转角度
	width?: number // 宽度
	height?: number // 高度
	xOffset?: number // x偏移量
	yOffset?: number // y偏移量
}
const props = withDefaults(defineProps<WatermarkProps>(), {
	visible: false,
	content: 'Watermark',
	rotate: -15,
	opacity: 0.1,
	fontSize: 16,
	width: 384,
	height: 384,
	xOffset: 12,
	yOffset: 60
})
</script>

<template>
	<n-watermark
		v-if="props.visible"
		:content="props.content"
		cross
		fullscreen
		:font-size="props.fontSize"
		:line-height="props.fontSize"
		:width="props.width"
		:height="props.height"
		:x-offset="props.xOffset"
		:y-offset="props.yOffset"
		:rotate="props.rotate"
	/>
</template>
