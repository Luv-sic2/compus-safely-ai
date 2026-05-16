export default async function handler(req, res) {
    // 允许跨域（双重保险）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 检查 Vercel 后台有没有填钥匙
    const apiKey = process.env.DEEPSEEK_KEY;
    if (!apiKey) {
        return res.status(200).json({ content: "⚠️ Vercel 后台未检测到秘钥！请前往 Vercel 项目的 Settings -> Environment Variables，添加一个名为 DEEPSEEK_KEY 的变量，Value 填你的 sk-... 秘钥。添加后记得重新 Deploy（部署）一次！" });
    }

    try {
        // 请求 DeepSeek 官方
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { "role": "system", "content": "你是一个校园安全专家。请针对用户上传的校园场景，随机从消防隐患、电力设施安全、交通人流冲突这三个维度中挑两个，给出一份通俗易懂、条理清晰的模拟安全评估报告。" },
                    { "role": "user", "content": "请执行校园安全风险实时识别分析。" }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            return res.status(200).json({ content: data.choices[0].message.content });
        } else {
            return res.status(200).json({ content: "⚠️ AI 未正常返回，请检查你的 DeepSeek 账户是否有余额或 Key 是否有效。官方返回信息：" + JSON.stringify(data) });
        }
    } catch (error) {
        return res.status(200).json({ content: "❌ 后台请求官方 AI 失败: " + error.message });
    }
}
