## 常用概念解析

### [@babel/types](https://babeljs.io/docs/en/babel-types)
`Babel Types` 模块是一个用于 AST 节点的 Lodash 式工具库（译注：Lodash 是一个 JavaScript 函数工具库，提供了基于函数式编程风格的众多工具函数）， 它包含了构造、验证以及变换 AST 节点的方法。 该工具库包含考虑周到的工具方法，对编写处理AST逻辑非常有用。

#### 日常可以用来判断节点类型
```
import t from '@babel/types'
import parser from '@babel/parser'
import traverse from '@babel/traverse'

const code = `function aaa(ccc) {
  return ccc
}`

const ast = parser.parse(code, {
  sourceType: 'module',
})
const visitor = {
  enter(path) {
    if (t.isIdentifier(path.node)) {
      console.log('Identifier!')
    }
  }
}
traverse(ast, visitor)
// Identifier! Identifier! Identifier!

```
#### 可以生成节点
```
import t from '@babel/types'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'

const code = `function aaa(ccc) {
  return ccc
}`

const ast = parser.parse(code, {
  sourceType: 'module',
})
//创建一个字符串字面量节点
const strNode = t.stringLiteral('mirror')
const visitor = {
  enter(path) {
    if (t.isIdentifier(path.node)) {
      console.log('Identifier!')
    }
  },
  ReturnStatement (path) {
    path.traverse({
      Identifier(cPath){
        cPath.replaceWith(strNode)
      }
    })
  }
}
traverse(ast, visitor)
const transformedCode = generate(ast).code
console.log(transformedCode)
//function mirror(something) {
//  return "mirror";
//}
```

### AST 节点解析
[官方文档](https://babeljs.io/docs/en/babel-types)
#### FunctionDeclaration（函数声明）
```
function a() {}
```
#### FunctionExpression（函数表达式）
```
var a = function() {}
```
#### ArrowFunctionExpression（箭头函数表达式）
```
()=>{}
```
#### CallExpression（调用表达式）
```
a()
```
#### Identifier（变量标识符）
```
var a(这里a是一个Identifier)
```
#### MemberExpression（成员表达式）
```
a.b
```
#### VariableDeclarator（变量声明）
```
var,const,let
```
#### NumericLiteral（数字字面量）
```
var a = 1
```

#### StringLiteral（字符串字面量）
```
var a = 'a'
```
#### BooleanLiteral（布尔值字面量））
```
var a = true
```
#### NullLiteral（null字面量）
```
var a = null
```

#### BlockStatement（块）
```
{}
```
#### ArrayExpression（数组表达式）
```
[]
```
#### ObjectExpression（对象表达式）
```
var a = null
```
#### SpreadElement（扩展运算符）
```
{...a},[...a]
```
#### ObjectProperty（对象属性）
```
{a:1}(这里的a:1是一个ObjectProperty)
```

#### ObjectMethod（函数属性）
```
{a(){}}
```
#### ExpressionStatement（表达式语句）
```
a()
```
#### IfStatement（if）
```
if () {}
```
#### ForStatement（for）
```
for (){}
```
#### ForInStatement（for in）
```
for (a in b) {}
```
#### ForOfStatement（for of）
```
if () {}
```
#### IfStatement（if）
```
for (a of b) {}
```
#### ImportDeclaration（import声明）
```
import 'a'
```
#### ImportDefaultSpecifier（import default说明符）
```
import a from 'a'
```
#### ImportSpecifier（import说明符）
```
import {a} from 'a'
```
#### NewExpression（new表达式）
```
new A()
```
#### ClassDeclaration（class声明）
```
class A {}
```
#### ClassBody（class body）
```
class A {}(类的内部)
```