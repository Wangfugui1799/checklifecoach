# AI Life Coach 网站

## 版本信息
当前版本：v0.1.5

### 更新日志
- v0.1.5：优化超时设置，改进重试机制，增强错误处理
- v0.1.4：优化API响应处理，提升系统稳定性
- v0.1.3：优化移动端响应式布局，修复已知bug
- v0.1.2：增加对话历史临时保存功能
- v0.1.1：改进AI响应速度和质量
- v0.1.0：初始版本发布

## 项目概述
本项目是一个基于火山方舟DeepSeek R1 API的AI对话网站，旨在提供一个个人Life Coach服务。通过与AI的对话，用户可以获得个人成长建议和指导。

## 技术架构
- 前端：HTML5、CSS3、JavaScript
- 后端：Node.js
- API：火山方舟DeepSeek R1 API
- 部署：Vercel

## 主要特性
- 实时对话：流式响应，即时显示AI回复
- 上下文理解：保持对话连贯性，提供更准确的建议
- 响应式设计：完美适配桌面和移动设备
- 错误处理：完善的错误提示和重试机制
- 临时会话：自动保存当前对话内容

## 页面结构

### 主页面 (index.html)
- **布局结构**：采用响应式设计，适配不同设备屏幕
  - 顶部：网站标题和简介
  - 中间：对话界面，包含消息历史区域和输入区域
  - 底部：版权信息和相关链接

- **样式说明**：
  - 使用柔和的色彩方案，创造舒适的对话环境
  - 对话气泡采用不同颜色区分用户和AI
  - 响应式布局，在移动设备上自动调整

## 功能模块

### 前端模块
1. **用户界面**：提供直观的对话输入和显示界面
2. **消息展示**：以对话气泡形式展示用户和AI的对话内容
3. **输入控制**：文本输入框和发送按钮，支持回车发送
4. **状态提示**：显示AI思考和响应状态
5. **错误处理**：友好的错误提示和重试选项

### 后端模块
1. **API代理**：Node.js服务器作为中间层，处理前端请求并转发到火山方舟API
2. **CORS处理**：解决跨域请求问题
3. **流式输出处理**：处理API的流式响应，实时显示AI回复
4. **错误处理**：完善的错误捕获和处理机制
5. **重试机制**：自动重试失败的API请求

## 实现细节

### 前端实现
- 使用语义化HTML标签构建页面结构
- 使用CSS Flexbox和Grid实现响应式布局
- 使用JavaScript处理用户输入和API响应
- 实现打字机效果的消息显示
- 优化移动端触摸体验

### 后端实现
- 使用Express框架创建简单的Node.js服务器
- 实现API代理功能，转发请求到火山方舟API
- 处理API密钥验证和错误响应
- 实现请求超时和重试逻辑
- 优化流式响应处理

## 优化方向
- 添加用户认证功能，保存对话历史
- 支持多种主题切换
- 添加语音输入功能
- 实现对话导出功能
- 增加更多个性化设置选项
- 优化API调用效率
- 添加数据分析功能

## 部署说明
项目使用Vercel进行部署，支持自动化构建和部署流程。详细部署步骤请参考DEPLOY.md文件。

## 安装说明
本地开发环境搭建和配置说明请参考INSTALL.md文件。