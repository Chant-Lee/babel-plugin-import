import ImportPlugin from './ImportPlugin'
const defaultOption = {
  libraryName: 'antd',
  libraryDirectory: 'lib',
  style: true,
}
const importPlugin = function ({ types: t }) {
  let plugins = null
  // 将插件作用到节点上
  function applyInstance(method, args, context) {
    for (const plugin of plugins) {
      if (plugin[method]) {
        plugin[method].apply(plugin, [...args, context])
      }
    }
  }
  const Program = {
    // ast 入口
    enter(path, { opts = defaultOption }) {
      const {
        libraryName,
        libraryDirectory,
        style,
        transformToDefaultImport,
      } = opts

      // 初始化插件实例
      if (!plugins) {
        plugins = [
          new ImportPlugin(
            libraryName,
            libraryDirectory,
            style,
            t,
            transformToDefaultImport
          ),
        ]
      }
      applyInstance('ProgramEnter', arguments, this)
    },
    // ast 出口
    exit() {
      applyInstance('ProgramExit', arguments, this)
    },
  }

  const result = {
    visitor: { Program },
  }

  // 插件只作用在 ImportDeclaration 和 CallExpression 上
  ;['ImportDeclaration', 'CallExpression'].forEach((method) => {
    result.visitor[method] = function () {
      applyInstance(method, arguments, result.visitor)
    }
  })
  return result
}
export default importPlugin
