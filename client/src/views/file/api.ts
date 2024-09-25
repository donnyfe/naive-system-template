import http, { Result } from '@/utils/request'
import qs from 'qs'

/** 获取文件上传任务Id */
export const getUploadId = () => http.get<Result<any>>('/upload/getUploadId')

/** 上传文件 */
export const uploadFile = (data, options) => http.post<Result<any>>('/upload/file', data, options)

/** 检查切片 */
export const checkChunk = (data) =>
	http.get<Result<any>>(`/upload/chunk/check?${qs.stringify(data)}`)

/** 上传文件切片 */
export const uploadChunk = (data, options) => http.post<Result<any>>('/upload/chunk', data, options)

/** 合并文件切片 */
export const mergeChunk = (data) => http.post<Result<any>>('/upload/chunk/merge', data)

/** 获取上传进度 */
export const getUploadProgress = (data) => http.get<Result<any>>('/upload/progress', data)
