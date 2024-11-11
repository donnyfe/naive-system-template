import http, { type Result } from '@/http/request'
import qs from 'qs'

/** 获取文件上传任务Id */
export const getUploadId = async () => http.get<Result<any>>('/api/upload/getUploadId')

/** 上传文件 */
export async function uploadFile(data: object | undefined, options: any) {
	return http.post<Result<any>>('/api/upload/file', data, options)
}

/** 检查切片 */
export async function checkChunk(data: object | undefined) {
	return http.get<Result<any>>(`/api/upload/chunk/check?${qs.stringify(data)}`)
}

/** 上传文件切片 */
export async function uploadChunk(data: object | undefined, options: any) {
	return http.post<Result<any>>('/api/upload/chunk', data, options)
}

/** 合并文件切片 */
export async function mergeChunk(data: object | undefined) {
	return http.post<Result<any>>('/api/upload/chunk/merge', data)
}

/** 获取上传进度 */
export async function getUploadProgress(data: object | undefined) {
	return http.get<Result<any>>('/api/upload/progress', data)
}
