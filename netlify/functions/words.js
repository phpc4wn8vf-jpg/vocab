import { getStore } from "@netlify/blobs";

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

  // 使用 Netlify Blobs 作为 KV 存储
  const store = getStore({ name: "words", consistency: "strong" });

  try {
    const { action, appId, data } = await req.json();

    if (action === 'read') {
      const words = await store.get(`words:${appId}`, { type: 'json' }) || [];
      return new Response(JSON.stringify({ words }), { headers });
    }

    if (action === 'write') {
      await store.set(`words:${appId}`, JSON.stringify(data.words));
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    if (action === 'create') {
      const newAppId = 'ielts_' + Math.random().toString(36).slice(2, 12);
      await store.set(`words:${newAppId}`, JSON.stringify([]));
      return new Response(JSON.stringify({ appId: newAppId }), { headers });
    }

    return new Response(JSON.stringify({ error: '未知 action' }), { 
      status: 400, headers 
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, headers 
    });
  }
};

export const config = { path: "/api/words" };
