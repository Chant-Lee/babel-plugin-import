/**
 * 转换成小写，添加连接符
 * @param {*} _str   字符串
 * @param {*} symbol 连接符
 */
export function transCamel(_str, symbol) {
  const str = _str[0].toLowerCase() + _str.substr(1)
  return str.replace(/([A-Z])/g, ($1) => `${symbol}${$1.toLowerCase()}`)
}

/**
 * 兼容 Windows 路径
 * @param {*} path
 */
export function winPath(path) {
  return path.replace(/\\/g, '/')
}
