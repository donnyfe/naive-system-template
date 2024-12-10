<script setup lang="ts">
import lib from '@/../package.json'
</script>

<template>
	<n-space vertical>
		<n-card :title="$t('about.title')">
			<article class="text-lg">
				本项目主要用于全方位实践前后端技术、数据库等综合技术栈。
			</article>
		</n-card>
		<n-card :title="$t('about.devDependencies')">
			<n-descriptions label-placement="left" bordered :column="4">
				<n-descriptions-item
					v-for="(item, key, index) in lib.devDependencies"
					:key="index"
					:label="key"
				>
					{{ item }}
				</n-descriptions-item>
			</n-descriptions>
		</n-card>
		<n-card :title="$t('about.dependencies')">
			<n-descriptions label-placement="left" bordered :column="4">
				<n-descriptions-item
					v-for="(item, key, index) in lib.dependencies"
					:key="index"
					:label="key"
				>
					{{ item }}
				</n-descriptions-item>
			</n-descriptions>
		</n-card>
	</n-space>
</template>

<style scoped></style>
