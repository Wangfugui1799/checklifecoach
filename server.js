/**
 * AI Life Coach 后端服务器
 * 用于处理前端请求并转发到火山方舟DeepSeek R1 API
 */

// 导入所需模块
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Readable } = require('stream');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3002;

// 中间件配置
app.use(cors()); // 启用CORS，解决跨域问题
app.use(express.json()); // 解析JSON请求体
app.use(express.static('.')); // 提供静态文件服务

// 火山方舟API配置
const API_KEY = process.env.API_KEY || 'b9ee4020-8985-44fa-9cae-25a3986eb244';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// 检查API密钥是否已正确配置
if (API_KEY === 'your_api_key_here') {
    console.error('警告: 使用了默认API密钥。请在.env文件中设置有效的API_KEY。');
}

// 系统提示词，定义AI的角色和行为
const SYSTEM_PROMPT = `你是一位专业的Life Coach，你的目标是通过对话帮助用户成长和发展。

作为Life Coach，你应该：
1. 倾听用户的问题和困惑，理解他们的需求
2. 提供有建设性的建议和指导，而不是简单地给出答案
3. 鼓励用户进行自我反思和探索
4. 帮助用户设定明确、可实现的目标
5. 提供实用的工具和方法来应对挑战
6. 保持积极、支持的态度，但也要诚实

你的回应应该个性化、有洞察力，并且基于用户提供的信息。避免过于笼统或通用的建议。`;

// 处理聊天请求的路由
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        if (!userMessage) {
            return res.status(400).json({ error: '消息不能为空' });
        }

        // 设置响应头，启用流式输出
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // 准备请求火山方舟API的数据
        const requestData = {
            model: 'deepseek-r1-250120',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userMessage }
            ],
            stream: true,  // 启用流式输出
            temperature: 0.6  // 设置温度参数
        };

        // 发送请求到火山方舟API
        const response = await axios({
            method: 'post',
            url: API_URL,
            data: requestData,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            responseType: 'stream',
            timeout: 60000  // 设置超时时间为60秒
        });

        // 处理流式响应
        response.data.on('data', (chunk) => {
            try {
                // 解析数据块
                const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
                
                for (const line of lines) {
                    // 跳过data: [DONE]行
                    if (line === 'data: [DONE]') continue;
                    
                    // 提取JSON部分
                    const jsonStr = line.replace(/^data: /, '');
                    
                    try {
                        const data = JSON.parse(jsonStr);
                        // 提取内容并发送到客户端
                        if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
                            res.write(data.choices[0].delta.content);
                        }
                    } catch (e) {
                        console.error('解析JSON失败:', e);
                    }
                }
            } catch (error) {
                console.error('处理数据块时出错:', error);
            }
        });

        // 处理流结束
        response.data.on('end', () => {
            res.end();
        });

        // 处理错误
        response.data.on('error', (err) => {
            console.error('流处理错误:', err);
            res.status(500).end('处理请求时发生错误: ' + err.message);
        });

    } catch (error) {
        console.error('API请求错误:', error);
        // 记录更详细的错误信息
        console.error('错误详情:', {
            message: error.message,
            stack: error.stack,
            response: error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            } : 'No response data'
        });
        
        // 如果响应头已经发送，则直接结束响应
        if (res.headersSent) {
            return res.end('处理请求时发生错误: ' + error.message);
        }
        
        // 构建更有用的错误消息
        let errorMessage = '处理请求时发生错误';
        if (error.response) {
            // API返回了错误响应
            errorMessage = `API服务器返回错误 (${error.response.status}): ${error.response.statusText || error.message}`;
        } else if (error.request) {
            // 请求已发送但没有收到响应
            errorMessage = '无法连接到API服务器，请检查网络连接和API服务状态';
        } else {
            // 请求设置时出错
            errorMessage = `请求配置错误: ${error.message}`;
        }
        
        // 发送错误状态码和详细消息
        res.status(500).json({ error: errorMessage });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`在浏览器中访问 http://localhost:${PORT} 来使用AI Life Coach`);
});