## 迁移过程遇到的问题
- store 单个组件内的注册问题
- 旧版react的class写法需要重构成函数式编程
- 旧的生命周期重构的问题


### 样式不生效的记录
原本直接引入 style 样式之后，能够直接在react 的render 函数中使用花括号{}使用，可能是用的webpack打包进行了处理，使用的是webpack v1，太古老，不再追溯，现在改用模块样式`*.module.less`的方式引入样式文件 