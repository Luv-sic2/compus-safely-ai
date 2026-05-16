export default async function handler(req, res) {
    // 1. 允许所有人前端网页访问这个接口（解决跨域问题）
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    // 如果是浏览器的探测请求，直接通过
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. 检查有没有在 Vercel 网页后台配置钥匙（API Key）
    const auth = process.env.DEEPSEEK_KEY;
    if (!auth) {
        return res.status(500).json({ content: "⚠️ 后台报错：你忘记在 Vercel 网页后台配置 DEEPSEEK_KEY 变量了！" });
    }

    try {
        let userContent = "执行校园安全风险实时识别分析。";
        
        // 自动解析前端发过来的各种格式的文本
        if (req.body) {
            if (typeof req.body === 'string') {
                try { const parsed = JSON.parse(req.body); if(parsed.message) userContent = parsed.message; } catch(e){}
            } else if (req.body.message) {
                userContent = req.body.message;
            }
        }

        // 3. 替前端去请求 DeepSeek 官方服务器
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { "role": "system", "content": "你是一个校园安全专家。请从消防、电力、交通三个维度给出专业的安全评估报告。" },
                    { "role": "user", "content": userContent }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        // 4. 把大模型的回答传回给你的前端网页
        if (data.choices && data.choices[0]) {
            return res.status(200).json({ content: data.choices[0].message.content });
        } else {
            return res.status(500).json({ content: "⚠️ AI 没理我们，官方返回错误: " + JSON.stringify(data) });
        }

    } catch (error) {
        return res.status(500).json({ content: "❌ 服务器连接失败: " + error.message });
    }
}
