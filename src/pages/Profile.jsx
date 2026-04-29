import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { getAuth } from 'firebase/auth';

export default function Profile({ currentUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.uid === userId) {
      setIsOwnProfile(true);
    }

    const fetchUserProfile = async () => {
      try {
        // Try to get from Firestore first
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserProfile(userSnap.data());
        } else {
          // If not in Firestore, create from Firebase Auth
          const firebaseAuth = getAuth();
          const user = firebaseAuth.currentUser;
          
          if (user && user.uid === userId) {
            const profile = {
              uid: user.uid,
              displayName: user.displayName || 'User',
              email: user.email,
              photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`,
              bio: '',
              createdAt: new Date(),
              followers: 0,
              following: 0
            };
            
            // Save to Firestore for future use
            await setDoc(userRef, profile);
            setUserProfile(profile);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const q = query(collection(db, 'posts'), where('authorId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPosts(posts.sort((a, b) => b.timestamp - a.timestamp));
      setLoading(false);
    });

    fetchUserProfile();
    return unsubscribe;
  }, [userId, currentUser]);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading profile...</div>;
  if (!userProfile) return <div style={{ textAlign: 'center', padding: '40px' }}>User not found</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          backgroundColor: '#550049',
          height: '120px',
          borderRadius: '8px 8px 0 0',
          marginBottom: '-40px',
          position: 'relative'
        }} />

        <div style={{ position: 'relative', paddingTop: '20px' }}>
          <img
            src={userProfile.photoURL || `https://ui-avatars.com/api/?name=${userProfile.displayName}`}
            alt={userProfile.displayName}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '4px solid white',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />

          <h1 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '24px' }}>
            {userProfile.displayName}
          </h1>

          <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>
            @{userProfile.displayName.toLowerCase().replace(' ', '')}
          </p>

          {userProfile.bio && (
            <p style={{ margin: '12px 0 0 0', color: '#374151' }}>
              {userProfile.bio}
            </p>
          )}

          <div style={{
            display: 'flex',
            gap: '24px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#550049' }}>
                {userPosts.length}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Posts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#550049' }}>
                {userProfile.followers || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Followers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#550049' }}>
                {userProfile.following || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Following</div>
            </div>
          </div>

          {isOwnProfile && (
            <button
              onClick={() => navigate('/edit-profile')}
              style={{
                marginTop: '16px',
                width: '100%',
                backgroundColor: '#550049',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>

      <div>
        <h2 style={{ color: '#374151', fontWeight: 'bold', marginBottom: '16px' }}>
          Posts
        </h2>

        {userPosts.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            No posts yet
          </div>
        ) : (
          userPosts.map((post) => (
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
              <p style={{ color: '#1f2937', marginBottom: '12px' }}>
                {post.content}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '14px' }}>
                <span>👍 {post.likes} likes</span>
                <span>
                  {post.timestamp?.toDate?.()?.toLocaleDateString?.() || 'Recently'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
