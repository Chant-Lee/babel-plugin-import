## babel-plugin-import

参考 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 实现

如果你对babel plugin 开发还是一点都不懂，推荐你看《[编写你的第一个 Babel Plugin](https://juejin.cn/post/6844904046965293069#heading-21)》 

#### 项目目录如下

```
  babel-plugin-import 
  ├─.babelrc.js
  ├─.gitignore
  ├─README.md
  ├─package-lock.json
  ├─package.json
  ├─rollup.config.js
  ├─test
  |  └ddd.js
  ├─removeConsole  //remove console 插件
  |       └index.js
  ├─lib
  |  └remove.js
  ├─build   // 编译后目录
  |   └ddd.js
```
#### 项目运行
```
  npm i
  npm run build
  npm run test
```

#### 如果你对语法树 和 babel 认识还是有点模糊，推荐你看完以下文章
* [【Babel系列 第二篇】Babel进阶使用指南](https://www.mdeditor.tw/pl/gblj)
* [AST in Modern JavaScript](https://zhuanlan.zhihu.com/p/32189701)
* [JavaScript抽象语法树AST ](https://github.com/yacan8/blog/blob/master/posts/JavaScript抽象语法树AST.md) - 语法树节点的介绍很详细，甚至可以当文档用
* [babel插件入门-AST（抽象语法树](https://juejin.im/post/6844903583549243406) -  偏实战
* [Babel 插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-stages-of-babel) - 参与了 babel 开源，文档很清晰，支持各种语言类型