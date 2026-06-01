# 儿童 TI — 你是什么儿童？

一个有趣的儿童人格测试小应用，24 道题测出你的童年人格。

## 🌐 在线访问

https://child-ti.pages.dev

## 📖 简介

儿童 TI 是一款纯前端娱乐测试应用，灵感来源于 MBTI 人格类型指标。通过 24 道趣味选择题，生成属于你的「儿童人格」标签。

> ⚠️ 纯属娱乐，无心理学背书，结果仅供参考，不构成育儿建议。

## 🎨 人格类型

共 24 种趣味儿童人格，包括但不限于：

- **502ER** — 永远 502 的粘人精
- **BOSS** — 天生领导者
- **CHAOS** — 混乱制造机
- **CTRL+C** — 复制粘贴大师
- **DAMN** — 人间小苦瓜
- **DAREN** — 社交小达人
- **ELON** — 未来发明家
- **GLUE** — 团队粘合剂
- **GODD** — 天选之子
- **IMOK** — 我很好真的
- ...以及更多

## 🛠 技术栈

- 纯 HTML / CSS / JavaScript
- 零框架依赖
- 零后端依赖
- 响应式设计，支持移动端

## 📁 项目结构

```
.
├── index.html          # 主页面（单文件应用）
├── assets/
│   ├── bg-texture.webp         # 背景纹理
│   ├── og-share-square.png     # 分享图（方形）
│   ├── og-share-wide.png       # 分享图（宽版）
│   └── personas/
│       └── persona-*.webp      # 24 种人格结果图
└── README.md
```

## 🚀 部署

本项目部署在 **Cloudflare Pages** 上。

### 本地预览

```bash
# 使用任意静态服务器
npx serve .
# 或
python -m http.server 8080
```

## 📄 许可

MIT License
