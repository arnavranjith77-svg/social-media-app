import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getTrendingHashtags } from '../utils/hashtagUtils';
import { useNavigate } from 'react-router-dom';

export default function TrendingHashtags() {
  const [trending, setTrending] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const trendingTags = getTrendingHashtags(posts, 5);
      setTrending(trendingTags);
    });

    return unsubscribe;
  }, []);

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      position: 'sticky',
      top: '80px'
    }}>
      <h3 style={{ marginTop: '0', color: '#374151', fontWeight: 'bold' }}>
        🔥 Trending Hashtags
      </h3>
      <div>
        {trending.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            No hashtags yet
          </p>
        ) : (
          trending.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/hashtag/${item.tag.replace('#', '')}`)}
              style={{
                padding: '12px',
                margin: '8px 0',
                backgroundColor: '#f3f4f6',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            >
              <span style={{ color: '#550049', fontWeight: 'bold' }}>
                {item.tag}
              </span>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                {item.count}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
