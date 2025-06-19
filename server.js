const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default:fetch}) => fetch(...args));
const qs = require('querystring');

const app = express();
const port = 4000;

const APP_ID = 'B11217002-0ad8e8f9-48f0-4631';
const APP_KEY = 'f193725f-d97a-453d-9cd0-85a3a98408c3';

// 取得 Access Token
async function getAccessToken() {
  const tokenUrl = 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token';

  const postData = {
    grant_type: 'client_credentials',
    client_id: APP_ID,
    client_secret: APP_KEY,
  };

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: qs.stringify(postData),
  });

  if (!response.ok) {
    throw new Error(`取得 token 失敗，狀態碼: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

app.use(cors());

app.get('/api/bus/:route', async (req, res) => {
  const route = req.params.route || '101';

  try {
    const token = await getAccessToken();

    const url = `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/YunlinCounty/${route}?$top=30&$format=JSON`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: 'API 錯誤', detail: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '無法取得資料', detail: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
