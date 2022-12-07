# 简介

> 主要实现了 vuecli5 的大部分功能

- [x] 基于 vue3 + webpack5
- [x] 路由管理：vue-router4.x
- [x] 状态管理：pinia2.x
- [x] 代码规范：eslint + prettier + vue3-recommended

- [x] 支持热更新
- [x] 支持 Typescript
- [x] 支持路由懒加载

# 内置第三方包

- [billd-utils](https://github.com/galaxy-s10/billd-utils)
- [billd-scss](https://github.com/galaxy-s10/billd-scss)，已在 sass-loader 里配置了 additionalData: `@use 'billd-scss/src/index.scss' as *;`
- [billd-html-webpack-plugin](https://github.com/galaxy-s10/billd-html-webpack-plugin)，已在 webpack 配置里使用了该插件
