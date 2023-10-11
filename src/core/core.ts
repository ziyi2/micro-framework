/**
 * 返回一个根据入参拼接 Hello 前缀的字符串
 *
 * @remarks
 * 该方法只能传入一个参数，不支持传入多个参数
 *
 * @param str - 需要拼接的字符串
 * @returns 拼接 Hello 前缀后的字符串
 *
 * @example 调用示例
 * ```ts
 * core('ziyi');
 * ```
 */
export function core(str: string): string {
  return `Hello ${str}`;
}

/**
 * 返回一个根据入参拼接 Hello 前缀的字符串
 *
 * @remarks
 * 该方法只能传入一个参数，不支持传入多个参数
 * 参数的类型只能是字符串
 * 更多详情信息可以查看 {@link https://github.com/microsoft/tsdoc | tsdoc 文档}
 *
 * @param str - 需要拼接的字符串
 * @returns 拼接 Hello 前缀后的字符串
 *
 * @example 调用示例
 * ```ts
 * hello('ziyi');
 * ```
 */
export function hello(str: string) {
  return `Hello ${str}`;
}
