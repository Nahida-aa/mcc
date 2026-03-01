export type InfoStatusCode = 100 | 101 | 102 | 103
export type SuccessStatusCode = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226
export type DeprecatedStatusCode = 305 | 306
export type RedirectStatusCode =
  | 300
  | 301
  | 302
  | 303
  | 304
  | DeprecatedStatusCode
  | 307 // 307 Temporary Redirect
  | 308
export type ClientErrorStatusCode =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451
export type ServerErrorStatusCode =
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511
/**
 * `UnofficialStatusCode` can be used to specify an unofficial status code.
 * @example
 *
 * ```ts
 * app.get('/unknown', (c) => {
 *   return c.text("Unknown Error", 520 as UnofficialStatusCode)
 * })
 * ```
 */
export type UnofficialStatusCode = -1

/**
 * If you want to use an unofficial status, use `UnofficialStatusCode`.
 */
export type StatusCode =
  | InfoStatusCode
  | SuccessStatusCode
  | RedirectStatusCode
  | ClientErrorStatusCode
  | ServerErrorStatusCode
  | UnofficialStatusCode
export type ContentlessStatusCode = 101 | 204 | 205 | 304
export type ContentfulStatusCode = Exclude<StatusCode, ContentlessStatusCode>

export class AppError extends Error {
  status: number
  // details?: unknown;
  constructor(
    message: string,
    status = 400,
    // details?: unknown,
    cause?: unknown,
  ) {
    super(message)
    const causeError = cause instanceof Error ? cause : undefined
    this.name = causeError ? causeError.name : 'AppError'
    this.cause = causeError?.cause
    this.message = message
    this.status = status
    console.log('AppError')
    console.log(this)
  }
  // 加 toJSON() 方法，自定义序列化（推荐）
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      // cause: this.cause,
      cause: '原因',
      // stack: dev ? this.stack : undefined,
    }
  }
}
/**
 * 工厂型语法糖函数, 简化错误处理, 将 HTTP 错误作为 App 错误, 叫做 AppErr
 * @example
 * throw AppErr('Bad Request', 400) // Bad Request
 * throw AppErr('未登录', 401) // Not Authorized
 * throw AppErr('无权限操作此项目', 403) // Forbidden
 * throw AppErr('项目未找到', 404) // Not Found
 * throw AppErr('资源状态冲突', 409) // Conflict, 想删除一个正在使用中的对象,或者创建重复唯一键记录,or 当前版本不是你预期的版本
 * throw AppErr('请求内容校验失败', 422) // Unprocessable Entity, 例如 zod
 * throw AppErr('请求过于频繁', 429) // Too Many Requests
 */
export const AppErr = (
  message: string = 'Bad Request',
  status: ContentfulStatusCode = 400,
  cause?: unknown,
) => new AppError(message, status, cause) // new HTTPException(status, { message })
