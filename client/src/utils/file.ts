/**
 * 创建切片
 * @param file
 * @returns
 */
export function createChunks(file: File, chunkSize: number): Blob[] {
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

/**
 * Blob转ArrayBuffer
 * @param chunks
 */
export async function getArrayBufferFromBlobs(chunks: Blob[]): Promise<ArrayBuffer[]> {
	return Promise.all(chunks.map(async (chunk) => chunk.arrayBuffer()))
}
