import http, { Result } from '@/utils/request'
import qs from 'qs'

/** 获取文件上传任务Id */
export const getUploadId = () => http.get<Result<any>>('/upload/getUploadId')

/** 上传文件 */
export const uploadFile = (data: object | undefined, options: any) =>
	http.post<Result<any>>('/upload/file', data, options)

/** 检查切片 */
export const checkChunk = (data: object | undefined) =>
	http.get<Result<any>>(`/upload/chunk/check?${qs.stringify(data)}`)

/** 上传文件切片 */
export const uploadChunk = (data: object | undefined, options: any) =>
	http.post<Result<any>>('/upload/chunk', data, options)

/** 合并文件切片 */
export const mergeChunk = (data: object | undefined) =>
	http.post<Result<any>>('/upload/chunk/merge', data)

/** 获取上传进度 */
export const getUploadProgress = (data: object | undefined) =>
	http.get<Result<any>>('/upload/progress', data)
