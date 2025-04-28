# DevTools - 开发者工具集

一个使用 Vue 3 + TypeScript 开发的现代开发者工具集合，提供各种实用的开发工具和功能。

## 功能特性

### 已实现功能

1. **格式化工具**
   - JSON格式化：支持JSON的格式化、验证和复制
   - 支持错误提示
   - 支持一键复制

2. **编码解码**
   - Base64编解码：支持文本的Base64编码和解码
   - 实时编码转换
   - 支持错误提示
   - 支持一键复制

3. **生成工具**
   - UUID生成器：支持批量生成UUID
   - 支持大小写选择
   - 支持分隔符选择
   - 支持批量复制

### 计划实现功能

1. **转换类**
   - 时间格式转换
   - 进制转换
   - JSON/YAML转换
   - CSV/JSON转换

2. **格式化类**
   - HTML格式化
   - XML格式化
   - JavaScript格式化

3. **加密解密类**
   - MD5加密
   - URL编码解码
   - JWT加解密

4. **MarkDown**
   - Markdown预览

5. **生成类**
   - 二维码生成
   - 随机数生成

6. **文本类**
   - 正则表达式测试
   - 文本对比
   - 文本去重
   - 文本统计

7. **JsonToModel**
   - Json转Swift模型
   - Json转Android模型
   - Json转Flutter模型
   - Json转CSharp模型
   - Json转Python模型

## 技术栈

- Vue 3.2+
- TypeScript 4.9+
- Element Plus 2.4+
- Vue Router 4.1+
- Vite 4.5+

## 项目结构

```
dev-tools/
├── src/
│   ├── components/     # 公共组件
│   │   └── Layout.vue  # 布局组件
│   ├── router/        # 路由配置
│   │   └── index.ts
│   ├── views/         # 页面组件
│   │   ├── formatter/  # 格式化工具
│   │   ├── encoder/   # 编码解码工具
│   │   └── generator/ # 生成工具
│   ├── App.vue       # 根组件
│   └── main.ts       # 入口文件
├── index.html        # HTML模板
├── package.json      # 项目配置
├── tsconfig.json     # TypeScript配置
└── vite.config.ts    # Vite配置
```

## 开发环境要求

- Node.js 16+
- pnpm 7+

## 安装和使用

1. 克隆项目
```bash
git clone [项目地址]
cd dev-tools
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 构建生产版本
```bash
pnpm build
```

## 使用说明

### JSON格式化
1. 在左侧输入框中粘贴JSON字符串
2. 自动进行格式化
3. 点击"复制"按钮复制格式化后的内容
4. 支持错误提示

### Base64编解码
1. 选择编码或解码模式
2. 在左侧输入要处理的文本
3. 自动进行编码或解码
4. 点击"复制"按钮复制结果

### UUID生成器
1. 设置生成数量（1-100）
2. 选择大小写格式
3. 选择是否使用分隔符
4. 点击"生成UUID"按钮
5. 可以复制单个UUID或全部结果

## 浏览器支持

- Chrome 最新版
- Firefox 最新版
- Safari 最新版
- Edge 最新版

## 贡献指南

欢迎提交问题和功能请求。如果您想贡献代码，请遵循以下步骤：

1. Fork 项目
2. 创建您的特性分支 (git checkout -b feature/AmazingFeature)
3. 提交您的更改 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 打开一个 Pull Request

## 更新日志

### v0.1.0
- 初始版本发布
- 实现JSON格式化功能
- 实现Base64编解码功能
- 实现UUID生成器功能

## 许可证

[MIT License](LICENSE)

## 作者

[您的名字]

## 致谢

- [Element Plus](https://element-plus.org/) - UI组件库
- [Vue.js](https://vuejs.org/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具