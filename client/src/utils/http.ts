/**
 * Promise 并发控制函数
 * 用于限制并发执行的 Promise 数量，同时保持执行顺序
 *
 * @param fns - 需要执行的函数数组，每个函数都应该返回 Promise
 * @param limit - 最大并发数
 * @returns Promise<Array> - 按照原始顺序返回所有 Promise 的执行结果
 *
 * @example
 * const tasks = [
 *   () => fetch('/api/1'),
 *   () => fetch('/api/2'),
 *   () => fetch('/api/3')
 * ]
 * const results = await promisePool(tasks, 2) // 最多同时执行2个请求
 */
export const promisePool = async function <T>(fns: (() => Promise<T>)[], limit: number) {
	// 参数校验
	if (!Array.isArray(fns)) {
		throw new TypeError('First argument must be an array of functions')
	}
	if (limit < 1) {
		throw new RangeError('Concurrency limit must be at least 1')
	}

	let index = 0 // 追踪当前执行到的任务索引
	const results: T[] = [] // 存储任务执行结果

	// 创建 limit 个执行器，每个执行器都会不断获取新任务执行
	const runners = Array(Math.min(limit, fns.length))
		.fill(null)
		.map(async () => {
			while (index < fns.length) {
				const currentIndex = index++
				try {
					results[currentIndex] = await fns[currentIndex]()
				} catch (error) {
					// 保留原始错误栈信息
					throw error instanceof Error ? error : new Error(String(error))
				}
			}
		})

	// 等待所有执行器完成
	await Promise.all(runners)

	return results
}

/**
 * 串行执行 Promise 函数数组
 * 按顺序执行数组中的每个函数,并收集它们的执行结果
 *
 * @param fns - 需要串行执行的函数数组,每个函数都应该返回 Promise
 * @returns Promise<T[]> - 按照原始顺序返回所有 Promise 的执行结果
 *
 * @example
 * const tasks = [
 *   () => fetch('/api/1'),
 *   () => fetch('/api/2'),
 *   () => fetch('/api/3')
 * ]
 * const results = await inOrderPromise(tasks) // 按顺序执行请求
 */
export const inOrderPromise = async function <T>(fns: (() => Promise<T>)[]) {
	// 参数校验
	if (!Array.isArray(fns)) {
		throw new TypeError('First argument must be an array of functions')
	}

	const results: T[] = []

	try {
		for (const fn of fns) {
			const result = await fn()
			results.push(result)
		}
		return results
	} catch (error) {
		// 保留原始错误栈信息
		throw error instanceof Error ? error : new Error(String(error))
	}
}
