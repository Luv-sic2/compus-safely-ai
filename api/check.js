export default async function handler(req, res) {
  // 这里读取的就是你在 Vercel 填写的 DEEPSEEK_KEY
  const auth = process.env.DEEPSEEK_KEY; 

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "model": "deepseek-chat",
        "messages": [
          {
            "role": "system", 
            "content": "你是一个校园安全专家。请从消防、电力、交通三个维度给出专业的安全评估报告，并给出简短的整改建议。"
          },
          {
            "role": "user", 
            "content": "执行校园安全风险实时识别分析。"
          }
        ]
      })
    });

    const data = await response.json();
    
    // 把 DeepSeek 回复的内容提取出来发回给网页
    if (data.choices && data.choices[0]) {
      res.status(200).json({ content: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "API 响应格式异常" });
    }

  } catch (error) {
    res.status(500).json({ error: "连接后端失败", detail: error.message });
  }
}
