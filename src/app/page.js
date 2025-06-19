'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [route, setRoute] = useState('101');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:4000/api/bus/${route}`);
      if (!res.ok) throw new Error('載入失敗');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError('無法取得資料，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [route]);

  const formatEstimate = (eta) => {
    const stop = eta.StopName.Zh_tw;
    const status = eta.StopStatus;
    let msg = `${stop}：`;

    switch (status) {
      case 0:
        msg += eta.EstimateTime !== null
          ? `${Math.floor(eta.EstimateTime / 60)} 分鐘抵達`
          : '無預估時間';
        break;
      case 1: msg += '尚未發車'; break;
      case 2: msg += '交管不停靠'; break;
      case 3: msg += '末班已過'; break;
      case 4: msg += '今日未營運'; break;
      default: msg += '未知狀態'; break;
    }
    return msg;
  };

  return (
    <main style={{
      padding: '2rem',
      fontFamily: '"Segoe UI", sans-serif',
      maxWidth: '700px',
      margin: '0 auto',
      backgroundColor: '#f0f4f8', // ☁️ 淡灰藍背景
      minHeight: '100vh',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#0050b3', // 更深藍色
          marginBottom: '1.5rem',
          fontSize: '2rem'
        }}>
          🚍 雲林公車即時資訊
        </h1>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <label style={{ fontWeight: '600', color: '#333' }}>
            選擇路線：
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              style={{
                marginLeft: '0.5rem',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            >
              <option value="101">101</option>
              <option value="201">201</option>
            </select>
          </label>

          <button
            onClick={fetchData}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0050b3',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#003c8f'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0050b3'}
          >
            🔄 重新整理
          </button>
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#666' }}>載入中...</p>}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem'
        }}>
          {data.map((d, i) => (
            <li key={i} style={{
              padding: '0.8rem 1rem',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              borderLeft: '5px solid #0050b3',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              fontSize: '1rem',
              color: '#222'
            }}>
              {formatEstimate(d)}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
