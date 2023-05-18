# react v18 脚手架
# 管理后台页面模板（微前端 - 主应用）
# npm node 16(16.14.2)

```
1、安装依赖
npm install

2、运行
npm run dev

3、打包编译
npm run release
```

## 目录结构

* src
  * components // 公共组件
  * constants // 静态配置
  * framework // 页面布局组件
  * images // 图片等资源文件
  * micro // 微应用配置文件
  * pages // 页面
  * stores // redux
  * services // 接口请求
  * styles // 通用样式
    * variable.scss 该文件已全局注入所有的scss文件中，不需要手动import来引入该文件即可使用其中的 变量、方法、mixin等
  * typings // 公共类型定义
  * utils // 工具函数
* mock // mock数据

## 微前端配置

在项目目录下的`/src/micro/apps`中可以配置子应用的路由匹配规则，由于当前暂未接入后端接口获取配置，当子应用的部署路径发生变化之后需要及时更新子应用的入口文件地址

## 注意事项

* 请自觉遵守eslint规则，不要忽视IDE的错误提示
* 项目使用redux，可在浏览器中安装[redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)
插件
* [Git Commit Message 强制规范](https://github.com/sparkbox/standard/blob/master/code-style/git/README.md)
* 项目中的antd样式均已添加前缀，用于主子应用之间的样式隔离，在重置antd样式时请注意前缀，scss文件中antd的前缀请使用统一变量
