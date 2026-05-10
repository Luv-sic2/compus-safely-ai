export default async function handler(req, res) {
  const auth = process.env.DEEPSEEK_KEY; 

  if (!auth) {
    return res.status(500).json({ content: "⚠️ 报错：Vercel 后台没找到 DEEPSEEK_KEY。请检查 Settings -> Environment Variables。" });
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "model": "deepseek-chat",
        "messages": [
          {"role": "system", "content": "你是一个校园安全专家。请从消防、电力、交通三个维度给出专业的安全评估报告。"},
          {"role": "user", "content": "执行校园安全风险实时识别分析。"}
        ]
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.status(200).json({ content: data.choices[0].message.content });
    } else {
      res.status(500).json({ content: "API 响应异常，请检查余额。" });
    }

  } catch (error) {
    res.status(500).json({ content: "连接失败：" + error.message });
  }
}
