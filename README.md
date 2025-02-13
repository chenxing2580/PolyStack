# PolyStack

<div align="center">

![PolyStack Logo](docs/images/logo.png)

强大的开发环境管理工具，帮助开发者轻松管理和切换不同的开发环境。

[![License](https://img.shields.io/github/license/chenxing2580/PolyStack)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/chenxing2580/PolyStack)](https://github.com/chenxing2580/PolyStack/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/chenxing2580/PolyStack)](https://github.com/chenxing2580/PolyStack/issues)

[English](README_EN.md) | 简体中文

</div>

## 🚀 功能特点

- 🛠️ **多环境管理**
  - PHP
  - Node.js
  - Python
  - MySQL
  - Redis
  - Nginx
  - 等等...
- 🖥️ **图形化界面**
- 🔄 **环境快速切换**
- 📝 **配置文件管理**
- 📊 **系统资源监控**
- 📋 **日志查看**
- 🌐 **多语言支持**
- 🎨 **主题切换**

## 🛠️ 技术栈

### 前端
- Vue 3
- TypeScript
- Element Plus
- Pinia
- Vue Router

### 后端
- Rust
- Tauri
- SQLite

## 📋 开发环境要求

- Node.js 16+
- Rust 1.70+
- Visual Studio 2019+ (Windows)
- Xcode (macOS)
- GCC/Clang (Linux)

## 🚀 快速开始

1. **克隆项目**
```bash
git clone https://github.com/chenxing2580/polystack.git
cd polystack
```

2. **安装依赖**
```bash
# 安装前端依赖
npm install

# 安装 Rust 依赖
cd src-tauri
cargo build
```

3. **开发**
```bash
npm run tauri dev
```

4. **构建**
```bash
npm run tauri build
```

## 📁 目录结构

```
polystack/
├── src/                # 前端源代码
│   ├── assets/        # 静态资源
│   ├── components/    # Vue 组件
│   ├── stores/        # Pinia 状态管理
│   ├── views/         # 页面视图
│   └── ...
├── src-tauri/         # Rust 后端源代码
│   ├── src/           # Rust 源代码
│   │   ├── main.rs    # 主程序
│   │   └── ...
│   └── ...
└── ...
```

## ⚙️ 配置

### 1. 环境配置
- 在 `设置` 页面中配置默认安装路径
- 配置各个环境的具体参数

### 2. 主题配置
- 支持浅色/深色主题
- 支持自动跟随系统

### 3. 语言配置
- 支持中文
- 支持英文

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 🙏 致谢

- [Tauri](https://tauri.app/)
- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Rust](https://www.rust-lang.org/)
