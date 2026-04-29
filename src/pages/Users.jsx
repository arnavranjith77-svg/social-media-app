import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

export default function Users({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredUsers = users.filter(u =>
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading users...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#1f2937', marginBottom: '24px', fontSize: '32px', fontWeight: 'bold' }}>
        👥 All Users ({users.length})
      </h1>

      {/* Search Users */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <p>No users found</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          {filteredUsers.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                  alt={user.displayName}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    marginBottom: '12px'
                  }}
                />

                <h3 style={{ margin: '0 0 4px 0', color: '#1f2937', fontWeight: 'bold' }}>
                  {user.displayName}
                </h3>

                <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '13px' }}>
                  @{user.displayName.toLowerCase().replace(' ', '')}
                </p>

                {user.bio && (
                  <p style={{ margin: '0 0 12px 0', color: '#374151', fontSize: '13px' }}>
                    {user.bio}
                  </p>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>{user.followers || 0}</div>
                    Followers
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>{user.following || 0}</div>
                    Following
                  </div>
                </div>

                {currentUser && currentUser.uid !== user.id && (
                  <button
                    style={{
                      marginTop: '12px',
                      width: '100%',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}
                  >
                    👁️ View Profile
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
