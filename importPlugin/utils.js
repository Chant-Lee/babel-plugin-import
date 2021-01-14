/**
 * 转换成小写，添加连接符
 * AbC =》 ab${symbol}c
 * @param {*} str   字符串
 * @param {*} symbol 连接符
 */
export function transCamel(str, symbol = '') {
  return str
    .replace(str.charAt(0), str.charAt(0).toLowerCase())
    .replace(/[A-Z]/g, ($1) => $1.replace($1, `${symbol}${$1.toLowerCase()}`))
}

/**
 * 兼容 Windows 路径
 * @param {*} path
 */
export function winPath(path) {
  return path.replace(/\\/g, '/')
}
