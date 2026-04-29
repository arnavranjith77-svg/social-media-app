import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

export default function Comments({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch comments for this post
  useEffect(() => {
    const q = query(collection(db, 'comments'), where('postId', '==', postId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    });

    return unsubscribe;
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    setLoading(true);

    try {
      await addDoc(collection(db, 'comments'), {
        postId: postId,
        author: user.displayName || 'Anonymous',
        authorId: user.uid,
        text: commentText,
        createdAt: new Date()
      });

      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId, authorId) => {
    if (user && user.uid === authorId) {
      try {
        await deleteDoc(doc(db, 'comments', commentId));
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div style={{ marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
      {/* Add Comment Form */}
      {user && (
        <form onSubmit={handleAddComment} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              disabled={loading || !commentText.trim()}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                opacity: (loading || !commentText.trim()) ? 0.6 : 1
              }}
            >
              {loading ? '...' : 'Comment'}
            </button>
          </div>
        </form>
      )}

      {/* Display Comments */}
      <div>
        {comments.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                backgroundColor: '#f9fafb',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '8px',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <Link
                  to={`/profile/${comment.authorId}`}
                  style={{
                    color: '#3b82f6',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    fontSize: '13px'
                  }}
                >
                  {comment.author}
                </Link>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {comment.createdAt?.toDate?.()?.toLocaleString?.() || 'Recently'}
                </span>
              </div>
              <p style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '13px' }}>
                {comment.text}
              </p>
              {user && user.uid === comment.authorId && (
                <button
                  onClick={() => handleDeleteComment(comment.id, comment.authorId)}
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
