type ValueOf<T> = T[keyof T]

export const ErrorInfo = {
  // 通用错误 (1xxxx)
  ERR_10000: { code: 10000, message: '请求参数格式错误' },
  ERR_10001: { code: 10001, message: '系统繁忙,请稍后重试' },
  ERR_10002: { code: 10002, message: '服务暂时不可用' },

  // 认证授权类错误 (11xxx)
  ERR_11001: { code: 11001, message: '请先登录后再操作' },
  ERR_11002: { code: 11002, message: '登录已过期,请重新登录' },
  ERR_11003: { code: 11003, message: '账号或密码错误' },
  ERR_11004: { code: 11004, message: '账号已被禁用' },
  ERR_11005: { code: 11005, message: '没有操作权限' },

  // 用户相关错误 (12xxx)
  ERR_12001: { code: 12001, message: '该用户名已被使用' },
  ERR_12002: { code: 12002, message: '验证码错误或已过期' },
  ERR_12003: { code: 12003, message: '密码格式不正确' },

  // 业务操作错误 (2xxxx)
  ERR_20001: { code: 20001, message: '该记录已存在' },
  ERR_20002: { code: 20002, message: '记录不存在或已删除' },
  ERR_20003: { code: 20003, message: '超出允许的最大数量限制' },

  // 文件存储错误 (3xxxx)
  ERR_30001: { code: 30001, message: '文件格式不支持' },
  ERR_30002: { code: 30002, message: '文件大小超出限制' },
  ERR_30003: { code: 30003, message: '文件上传失败' },
} as const

export type ErrInfo = ValueOf<typeof ErrorInfo>
