export default async function handler(req, res) {
    const token = process.env.COZE_API_KEY; 
    const response = await fetch('https://api.coze.cn/v3/chat', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "bot_id": "7638218421255356452", 
            "user_id": "student_test",
            "stream": false,
            "additional_messages": [{
                "role": "user",
                "content": "请对校园图片进行安全风险识别", 
                "content_type": "text"
            }]
        })
    });
    const data = await response.json();
    res.status(200).json(data);
}
