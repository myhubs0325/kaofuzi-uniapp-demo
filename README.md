# 考夫子教评助手 · Vue / uni-app 迁移版

这个项目不是原来的 React 展示页，而是重新拆出来的“真机 demo 专用版本”。

目标：

- 保留手机端页面和交互
- 先做 H5 可交互预览
- 目录按 uni-app 页面迁移思路拆分
- 后续继续接小程序版

## 当前包含的页面

- 首页
- 考夫子
- 学习
- 我的
- 错题本
- 考前冲刺
- 考夫子讲题
- 老师反馈
- 练题流程
- 拍照检查流程
- 进步结果页

## 启动

```bash
npm install
npm run dev
```

默认地址：

`http://localhost:5193`

## 构建

```bash
npm run build
```

## 当前目录说明

- `src/pages`：按页面拆分
- `src/components`：公共组件
- `src/composables`：交互状态流
- `src/data`：演示数据
- `pages.json` / `manifest.json` / `uni.scss`：为后续迁入正式 uni-app 工程预留
