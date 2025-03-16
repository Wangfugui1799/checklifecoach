# 部署指南

## GitHub部署

1. 在GitHub上创建一个新的仓库
2. 初始化本地Git仓库并提交代码：

```bash
git init
git add .
git commit -m "初始提交"
git branch -M main
git remote add origin 你的GitHub仓库URL
git push -u origin main
```

## Vercel部署

1. 在Vercel上注册账号并连接到你的GitHub账号
2. 导入你刚刚创建的GitHub仓库
3. 在Vercel的环境变量设置中添加以下变量：
   - `API_KEY`: 你的火山方舟DeepSeek R1 API密钥
4. 点击部署按钮

## 本地开发

1. 克隆仓库：
```bash
git clone 你的GitHub仓库URL
cd 仓库名称
```

2. 安装依赖：
```bash
npm install
```

3. 创建`.env`文件并添加API密钥：
```
API_KEY=你的火山方舟DeepSeek R1 API密钥
```

4. 启动开发服务器：
```bash
npm run dev
```

## 注意事项

- 确保API密钥不要直接提交到GitHub仓库中
- 在Vercel上部署后，可能需要等待几分钟才能完全生效
- 如果遇到CORS问题，请检查服务器配置