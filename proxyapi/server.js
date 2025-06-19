const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const port = 4000;

// PTX 身分驗證資訊（安全地放在後端）
const APP_ID = 'B11217002-0ad8e8f9-48f0-4631';
const APP_KEY = 'f193725f-d97a-453d-9cd0-85a3a98408c3';

// HMAC 認證 Header 產生器
function getAuthorizationHeader() {
  const xDate = new Date().toUTCString();
  const signature = crypto.createHmac('sha1', APP_KEY)
    .update('x-date: ' + xDate)
    .digest('base64');
  const authorization = `hmac username="${APP_ID}", algorithm="hmac-sha1", headers="x-date", signature="${signature}"`;
  return {
    'Authorization': authorization,
    'x-date': xDate
  };
}

// CORS：允許前端呼叫這個 proxy
app.use(cors());

// API Proxy 路由
app.get('/api/bus/:route', async (req, res) => {
  const route = req.params.route;
  const headers = getAuthorizationHeader();
  const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Yunlin/${route}?$format=JSON`;

  try {
    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('API 錯誤:', error.message);
    res.status(500).json({ error: '伺服器錯誤，請稍後再試' });
  }
});

// 啟動 Server
app.listen(port, () => {
  console.log(`後端 Proxy 已啟動：http://localhost:${port}`);
});