// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const messageArea = document.getElementById('messageArea');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // 初始化变量
    let isWaitingForResponse = false; // 是否正在等待AI响应
    let currentResponseElement = null; // 当前响应元素

    // 监听发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);

    // 监听输入框回车事件
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 阻止默认的回车换行
            sendMessage();
        }
    });

    // 自动调整输入框高度
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // 发送消息函数
    function sendMessage() {
        const message = userInput.value.trim();
        
        // 检查消息是否为空
        if (message === '' || isWaitingForResponse) {
            return;
        }

        // 添加用户消息到聊天区域
        addMessage(message, 'user');
        
        // 清空输入框并重置高度
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // 设置等待状态
        isWaitingForResponse = true;
        sendButton.disabled = true;
        
        // 添加AI消息占位符
        addMessage('', 'ai', true);
        
        // 发送请求到后端
        fetchAIResponse(message);
    }

    // 添加消息到聊天区域
    function addMessage(content, sender, isLoading = false) {
        // 创建消息容器
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        // 创建消息内容元素
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (isLoading) {
            // 如果是加载状态，添加加载动画
            contentDiv.innerHTML = '<p class="typing-indicator">思考中<span>.</span><span>.</span><span>.</span></p>';
            currentResponseElement = contentDiv; // 保存当前响应元素的引用
        } else {
            // 普通消息，添加文本内容
            contentDiv.innerHTML = `<p>${content}</p>`;
        }
        
        // 将内容添加到消息容器
        messageDiv.appendChild(contentDiv);
        
        // 将消息添加到聊天区域
        messageArea.appendChild(messageDiv);
        
        // 滚动到底部
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    // 更新AI响应内容
    function updateAIResponse(content) {
        if (currentResponseElement) {
            // 处理段落分隔
            const paragraphs = content.split('\n\n');
            const formattedContent = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
            currentResponseElement.innerHTML = formattedContent;
            // 滚动到底部
            messageArea.scrollTop = messageArea.scrollHeight;
        }
    }

    // 从后端获取AI响应
    async function fetchAIResponse(userMessage) {
        try {
            // 发送请求到后端API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage
                })
            });

            // 检查响应状态
            if (!response.ok) {
                throw new Error('API请求失败');
            }

            // 处理流式响应
            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let aiResponse = '';

                // 读取流数据
                while (true) {
                    const { done, value } = await reader.read();
                    
                    if (done) {
                        break;
                    }
                    
                    // 解码并添加到响应
                    const chunk = decoder.decode(value, { stream: true });
                    aiResponse += chunk;
                    
                    // 更新UI
                    updateAIResponse(aiResponse);
                }
            }
        } catch (error) {
            console.error('获取AI响应时出错:', error);
            updateAIResponse('抱歉，我遇到了一些问题。请稍后再试。');
        } finally {
            // 重置状态
            isWaitingForResponse = false;
            sendButton.disabled = false;
            currentResponseElement = null;
        }
    }
});

// 添加CSS样式
document.head.insertAdjacentHTML('beforeend', `
<style>
/* 打字指示器动画 */
.typing-indicator {
    display: flex;
    align-items: center;
}

.typing-indicator span {
    animation: typingDot 1.4s infinite ease-in-out;
    margin: 0 1px;
}

.typing-indicator span:nth-child(1) {
    animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typingDot {
    0%, 60%, 100% { opacity: 0.3; transform: scale(1); }
    30% { opacity: 1; transform: scale(1.2); }
}
</style>
`);