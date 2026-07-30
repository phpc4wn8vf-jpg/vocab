export default async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  const MOONSHOT_KEY = Netlify.env.get('MOONSHOT_API_KEY');
  if (!MOONSHOT_KEY) {
    return new Response(JSON.stringify({ error: '未配置 MOONSHOT_API_KEY' }), { 
      status: 500, headers 
    });
  }

  try {
    const { image } = await req.json();

    const visionPrompt = `你是一个英语单词提取专家。请仔细分析这张图片，
      找出图片中所有英文单词（忽略中文、标点符号、数字）。
      要求：
      1. 只输出英文单词，每行一个
      2. 如果图片是单词表，请完整提取所有单词
      3. 如果图片是场景图，提取图片中最相关的3-10个英文单词
      4. 不要输出任何解释、标点或编号
      5. 单词全部小写
      
      示例输出格式：
      comprehensive
      accommodation
      sustainable`;

    const resp = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MOONSHOT_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k-vision-preview',
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: image } },
            { type: 'text', text: visionPrompt }
          ]
        }],
        temperature: 0.3
      })
    });

    const data = await resp.json();
    if (!resp.ok) {
      return new Response(JSON.stringify({ 
        error: data.error?.message || 'AI 调用失败' 
      }), { status: resp.status, headers });
    }

    return new Response(JSON.stringify({ 
      result: data.choices?.[0]?.message?.content || '' 
    }), { headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, headers 
    });
  }
};

export const config = { path: "/api/ai" };
