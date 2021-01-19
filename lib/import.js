'use strict';

var path = require('path');
var helperModuleImports = require('@babel/helper-module-imports');

/**
 * 转换成小写，添加连接符
 * AbC =》 ab${symbol}c
 * @param {*} str   字符串
 * @param {*} symbol 连接符
 */
function transCamel(str, symbol = '') {
  return str
    .replace(str.charAt(0), str.charAt(0).toLowerCase())
    .replace(/[A-Z]/g, ($1) => $1.replace($1, `${symbol}${$1.toLowerCase()}`))
}

/**
 * 兼容 Windows 路径
 * @param {*} path
 */
function winPath(path) {
  return path.replace(/\\/g, '/')
}

class ImportPlugin {
  libraryName = '' //需要使用按需加载的包名
  libraryDirectory = 'lib' // 按需加载的目录
  style = false // 是否加载样式
  t //babel-type 工具函数
  transformToDefaultImport = true

  constructor(
    libraryName,
    libraryDirectory = 'lib',
    style = false,
    t,
    transformToDefaultImport = true
  ) {
    this.libraryName = libraryName;
    this.libraryDirectory = libraryDirectory;
    this.style = style;
    this.t = t;
    this.transformToDefaultImport = transformToDefaultImport;
  }

  /**
   * 获取内部状态，收集依赖
   * @param {*} state
   */
  getPluginState(state) {
    if (!state) {
      state = {};
    }
    return state
  }
  ProgramEnter(path, state) {
    const pluginState = this.getPluginState(state);
    // 问题，为啥不直接使用  pluginState.specified = {}
    //  Object.create(null) 不会继承任何原型方法，也就是它的原型链没有上一层
    pluginState.specified = Object.create(null);
    pluginState.selectedMethods = Object.create(null);
    pluginState.pathsToRemove = [];
  }

  ProgramExit(path, state) {
    // 删除旧的 import
    this.getPluginState(state).pathsToRemove.forEach(
      (p) => !p.removed && p.remove()
    );
  }
  /**
   * ImportDeclaration 节点的处理方法
   * @param {*} path
   * @param {*} state
   */
  ImportDeclaration(path, state) {
    const { node } = path;
    if (!node) return
    // 代码里 import 的包名
    const { value } = node.source;
    // 配在插件 options 的包名
    const { libraryName } = this;

    // 内部状态
    const pluginState = this.getPluginState(state);
    // 判断是不是需要使用该插件的包
    if (value === libraryName) {
      // node.specifiers 表示 import 了什么
      node.specifiers.forEach((spec) => {
        // 判断是不是 ImportSpecifier 类型的节点，也就是是否是大括号的
        if (this.t.isImportSpecifier(spec)) {
          // 收集依赖
          // 也就是 pluginState.specified.Button = Button
          // local.name 是导入进来的别名，比如 import { Button as MyButton } from 'antd' 的 MyButton
          // imported.name 是真实导出的变量名
          pluginState.specified[spec.local.name] = spec.imported.name;
        } else {
          // ImportDefaultSpecifier 和 ImportNamespaceSpecifier
          pluginState.libraryObjs[spec.local.name] = true;
        }
      });
      // 收集旧的依赖
      pluginState.pathsToRemove.push(path);
    }
  }
  CallExpression(path, state) {
    const { node } = path;
    const file = (path && path.hub && path.hub.file) || (state && state.file);
    // 方法调用者的 name
    const { name } = node.callee;
    // 内部状态
    const pluginState = this.getPluginState(state);

    // 如果方法调用者是 Identifier 类型
    if (this.t.isIdentifier(node.callee)) {
      if (pluginState.specified[name]) {
        node.callee = this.importMethod(
          pluginState.specified[name],
          file,
          pluginState
        );
      }
    }

    // 遍历 arguments 找我们要的 specifier
    node.arguments = node.arguments.map((arg) => {
      const { name: argName } = arg;
      if (
        pluginState.specified[argName] &&
        path.scope.hasBinding(argName) &&
        path.scope.getBinding(argName).path.type === 'ImportSpecifier'
      ) {
        // 找到 specifier，调用 importMethod 方法
        return this.importMethod(
          pluginState.specified[argName],
          file,
          pluginState
        )
      }
      return arg
    });
  }
  importMethod(methodName, file, pluginState) {
    if (!pluginState.selectedMethods[methodName]) {
      // libraryDirectory：目录，默认 lib
      // style：是否引入样式
      const { style, libraryDirectory, libraryName } = this;
      // 组件名转换规则
      const transformedMethodName = transCamel(methodName, '');
      // 兼容 windows 路径
      // path.join('antd/lib/button') == 'antd/lib/button'
      const path$1 = winPath(
        path.join(libraryName, libraryDirectory, transformedMethodName)
      );
      // 生成 import 语句
      // import Button from 'antd/lib/button'
      pluginState.selectedMethods[methodName] = this.transformToDefaultImport
        ? helperModuleImports.addDefault(file.path, path$1, {
            nameHint: methodName,
          })
        : helperModuleImports.addNamed(file.path, methodName, path$1);
      if (style) {
        // 生成样式 import 语句
        // import 'antd/lib/button/style'
        helperModuleImports.addSideEffect(file.path, `${path$1}/style`);
      }
    }
    return { ...pluginState.selectedMethods[methodName] }
  }
}

const defaultOption = {
  libraryName: 'antd',
  libraryDirectory: 'lib',
  style: true,
};
const importPlugin = function ({ types: t }) {
  let plugins = null;
  // 将插件作用到节点上
  function applyInstance(method, args, context) {
    for (const plugin of plugins) {
      if (plugin[method]) {
        plugin[method].apply(plugin, [...args, context]);
      }
    }
  }
  const Program = {
    // ast 入口
    enter(path, { opts = defaultOption }) {
      const { libraryName, libraryDirectory, style } = opts;

      // 初始化插件实例
      if (!plugins) {
        plugins = [new ImportPlugin(libraryName, libraryDirectory, style, t)];
      }
      applyInstance('ProgramEnter', arguments, this);
    },
    // ast 出口
    exit() {
      applyInstance('ProgramExit', arguments, this);
    },
  };

  const result = {
    visitor: { Program },
  }

  // 插件只作用在 ImportDeclaration 和 CallExpression 上
  ;['ImportDeclaration', 'CallExpression'].forEach((method) => {
    result.visitor[method] = function () {
      applyInstance(method, arguments, result.visitor);
    };
  });
  return result
};

module.exports = importPlugin;
