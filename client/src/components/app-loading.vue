<script setup lang="ts">
</script>

<template>
	<naive-provider>
		<div id="loading-container">
			<div class="loader" />
		</div>
	</naive-provider>
</template>

<style scoped>
#loading-container {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 15vh;
	position: fixed;
	background-color: #fff;
	z-index: 1;
}

.loader {
	width: 124px;
	height: 24px;
	mask:
		conic-gradient(from 135deg at top, #0000, #000 .5deg 90deg, #0000 90.5deg) 0 0,
		conic-gradient(from -45deg at bottom, #0000, #000 .5deg 90deg, #0000 90.5deg) 0 100%;
	mask-size: 25% 50%;
	mask-repeat: repeat-x;
	background: linear-gradient(#ddd 0 0) left/0% 100% no-repeat #f7f7f7;
	animation: l13 2s infinite linear;
}

@keyframes l13 {
	100% {
		background-size: 100% 100%
	}
}
</style>
