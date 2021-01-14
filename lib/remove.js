'use strict';

const removePlugin = function ({ types: t, template }) {
  return {
    name: 'transform-remove-console',
    visitor: {
      //需要访问的节点名
      //访问器默认会被注入两个参数 path（类比成dom），state
      ExpressionStatement(path, { opts }) {
        // 拿到object与property, 比如console.log语句的object name为console, property name为log
        const { object, property } = path.node.expression.callee;
        // 如果表达式语句的object name不为console, 不作处理
        if (object.name !== 'console') return
        // 如果不是, 删除此条语句
        if (
          !opts.ignore ||
          !opts.ignore.length ||
          !opts.ignore.includes(property.name)
        )
          path.remove();
      },
    },
  }
};

module.exports = removePlugin;
