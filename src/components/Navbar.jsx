import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav style={{
      backgroundColor: '#dd800f',
      color: 'white',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
        😀 ZUMBA
      </Link>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {user ? (
          <>
            <Link 
              to={`/profile/${user.uid}`}
              style={{ color: 'white', textDecoration: 'none' }}
            >
              👤 My Profile
            </Link>
            <button 
              onClick={onLogout}
              style={{
                backgroundColor: '#008cff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login"
              style={{ backgroundColor: '#008cff',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none' 
              }}
            >
              Login
            </Link>
            <Link 
              to="/signup"
              style={{
                backgroundColor: '#008cff',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none'
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