<script setup lang="ts">
import lib from '@/../package.json'
</script>

<template>
	<n-space vertical>
		<n-card :title="$t('about.title')">
			{{ $t('about.intro') }}
		</n-card>
		<n-card :title="$t('about.devDependencies')">
			<n-descriptions label-placement="left" bordered :column="4">
				<n-descriptions-item v-for="(item, key, index) in lib.devDependencies" :key="index" :label="key">
					{{ item }}
				</n-descriptions-item>
			</n-descriptions>
		</n-card>
		<n-card :title="$t('about.dependencies')">
			<n-descriptions label-placement="left" bordered :column="4">
				<n-descriptions-item v-for="(item, key, index) in lib.dependencies" :key="index" :label="key">
					{{ item }}
				</n-descriptions-item>
			</n-descriptions>
		</n-card>
	</n-space>
</template>

<style scoped></style>
