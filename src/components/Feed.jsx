import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import TrendingHashtags from './TrendingHashtags';
import Comments from './Comments';
import { Link } from 'react-router-dom';

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handlePostCreate = async () => {
    if (newPost.trim() && user) {
      try {
        await addDoc(collection(db, 'posts'), {
          author: user.displayName || 'Anonymous',
          authorId: user.uid,
          content: newPost,
          timestamp: new Date(),
          likes: 0,
          dislikes: 0,
          neverpostagains: 0
        });
        setNewPost('');
      } catch (error) {
        console.error('Error adding post:', error);
        alert('Error creating post');
      }
    }
  };

  const handleLike = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { likes: increment(1) });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { dislikes: increment(1) });
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  const handleNeverpostagain = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { neverpostagains: increment(1) });
    } catch (error) {
      console.error('Error with never post again:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading posts...</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '20px', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ flex: 1 }}>
        {user && (
          <div style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px', border: '1px solid #e5e7eb'
          }}>
            <p style={{ color: '#374151', marginBottom: '12px', fontWeight: 'bold' }}>What's on your mind?</p>
            <textarea
              style={{
                width: '100%', padding: '12px', border: '1px solid #d1d5db',
                borderRadius: '8px', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
              }}
              placeholder="Share something..." rows="4" value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <button
              onClick={handlePostCreate}
              style={{
                marginTop: '12px', backgroundColor: '#550049', color: 'white',
                padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              Post
            </button>
          </div>
        )}

        <div>
          {posts.length === 0 ? (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', color: '#9ca3af' }}>
              <p>No posts yet. {!user && 'Sign up to create your first post!'}</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} style={{
                backgroundColor: 'white', padding: '16px', marginBottom: '16px',
                borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Link to={`/profile/${post.authorId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={`https://ui-avatars.com/api/?name=${post.author}`} alt={post.author} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      <h3 style={{ margin: '0', fontWeight: 'bold' }}>{post.author}</h3>
                    </div>
                  </Link>
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                    {post.timestamp?.toDate?.()?.toLocaleString() || 'Recently'}
                  </span>
                </div>

                <p style={{ color: '#1f2937', marginBottom: '12px' }}>
                  {post.content.split(' ').map((word, index) => (
                    <span key={index}>
                      {word.startsWith('#') ? <span style={{ color: '#550049', fontWeight: 'bold' }}>{word}</span> : word}{' '}
                    </span>
                  ))}
                </p>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <button onClick={() => handleLike(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    👍 Like ({post.likes || 0})
                  </button>
                  
                  <button onClick={() => handleDislike(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#550049' }}>
                    👎 Dislike ({post.dislikes || 0})
                  </button>
                  
                  <button onClick={() => handleNeverpostagain(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    🤬 Never Post Again ({post.neverpostagains || 0})
                  </button>

                  <button onClick={() => toggleComments(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    💬 Comment
                  </button>

                  {user && user.uid === post.authorId && (
                    <button onClick={() => handleDelete(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#550049' }}>
                      🗑️ Delete
                    </button>
                  )}
                </div>

                {expandedComments[post.id] && (
                  <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                    <Comments postId={post.id} user={user} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ width: '280px' }}>
        <TrendingHashtags />
      </div>
    </div>
  );
}