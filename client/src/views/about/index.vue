<script setup lang="ts">
import lib from '@/../package.json'
</script>

<template>
	<n-space vertical>
		<n-card :title="$t('about.title')">
			<article class="text-lg">
				这是一款基于Vue3和NestJS架构设计的全栈后台管理应用。
				<br />
				<br />
				前端技术栈：Vue3 + NaiveUI + TypeScript + Unocss。
				<br />
				后端技术栈：NestJS + TypeORM + MySQL + Redis。
				<br />
				<br />
				本项目只用于学习交流，目前仍在建设中，主要目的在于全方位实践学习前后端技术、数据库、运维部署等技术。
				<br />
				目前项目开发仍以服务应用基础架构建设为主，后续会逐步完善前后端功能模块开发。
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
