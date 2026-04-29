import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav style={{
      backgroundColor: '#550049',
      color: 'white',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
        🍇 Grapevine 1.0 (made with the help of AI)
      </Link>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        
        <Link 
  to="/watchlist"
  style={{ 
    color: 'white', 
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }}
>
  📊 Stock Market
</Link>
        
       <Link 
  to="/users"
  style={{ 
    color: 'white', 
    textDecoration: 'none',
    fontWeight: 'bold'
  }}
>
  👥 Users
</Link>
        {
        
        
user ? (
          <>
            <Link 
              to={`/profile/${user.uid}`}
              style={{ 
                color: 'white', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                alt="Profile"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid white'
                }}
              />
              <span>{user.displayName}</span>
            </Link>
            <button 
              onClick={onLogout}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login"
              style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
            >
              Login
            </Link>
            <Link 
              to="/signup"
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
