# 迁移过程遇到的问题
- store 单个组件内的注册问题
- 旧版react的class写法需要重构成函数式编程
- 旧的生命周期重构的问题


## 样式不生效的记录
原本直接引入 style 样式之后，能够直接在react 的render 函数中使用花括号{}使用，可能是用的webpack打包进行了处理，使用的是webpack v1，太古老，不再追溯，现在改用模块样式`*.module.less`的方式引入样式文件

---
## react 15 类组件升级 到react 18 函数式组件要解决的问题
- state 的使用方式
- 重构弃用的生命周期中的脚本


### 修改生命周期
将原本类组件中的生命周期`componentWillMount` `componentDidMount` 删除，使用`useEffect`替换
`componentWillMount` `componentDidMount` 是在render函数执行前与后触发的事件 参考 [官方文档](https://react.dev/reference/react/Component#componentwillmount)

### 替换类组件中的`shouldComponentUpdate`
[`shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate) 在类组件中使用，开发者可以自主判断props 是否改变，以及一些其他条件，通过返回值决定当前组件是否需要跟随父组件刷新

[`memo`](https://react.dev/reference/react/memo) 可以让函数式组件在props没有变化的时候跳过re-render

### 替换原组件中的ref
原本组件中的ref也是通过 组件上添加回调的方式添加的 类似：`ref={c => { refMap.dom_down = c }}`, 在之前并没有声明； 在react18中使用`useRef`来声明引用。
注意： 不能动态遍历添加 `ref` ，react禁止这种方式添加，可以声明对象的方式， 在需要引用的组件上通过回调进行ref的动态赋值。