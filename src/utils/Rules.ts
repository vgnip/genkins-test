
export const NameRule = /^[\w\u4E00-\u9FA5-]+$/
export const CodeRule = /^[a-z][a-z0-9_]{0,19}$/

/**
 * 编码校验函数
 * @param {number} [max] - 最大字符数
 * @returns {Function} 校验函数
 */
export function codeValidator(max = 20) {
  return (rule: any, value: any, callback: any) => {
    // 处理null/undefined和前后空格
    const val = (value || '').toString().trim()
    if (val === '') {
      callback(new Error(rule.emptyMsg || "非空"))
    } else {
      callback()
    }
  }
}
