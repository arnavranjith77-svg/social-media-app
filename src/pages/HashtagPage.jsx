import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getPostsByHashtag } from '../utils/hashtagUtils';

export default function HashtagPage({ user }) {
  const { hashtag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = getPostsByHashtag(allPosts, hashtag);
      setPosts(filtered);
      setLoading(false);
    });

    return unsubscribe;
  }, [hashtag]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#550049', marginBottom: '20px' }}>
        #{hashtag}
      </h1>
      
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '16px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p style={{ margin: '0' }}>
          Found <strong>{posts.length}</strong> posts with #{hashtag}
        </p>
      </div>

      {posts.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          No posts found with #{hashtag}
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              backgroundColor: 'white',
              padding: '16px',
              marginBottom: '16px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ margin: '0', fontWeight: 'bold' }}>{post.author}</h3>
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                {post.timestamp?.toDate?.()?.toLocaleString?.() || 'Recently'}
              </span>
            </div>
            <p style={{ color: '#1f2937', marginBottom: '12px' }}>
              {post.content.split(' ').map((word, index) => (
                <span key={index}>
                  {word.startsWith('#') ? (
                    <span style={{ color: '#550049', fontWeight: 'bold' }}>
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                  {' '}
                </span>
              ))}
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                👍 Like ({post.likes})
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                💬 Comment
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
