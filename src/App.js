import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HashtagPage from './pages/HashtagPage';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Watchlist from './pages/Watchlist';
import Users from './pages/Users';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Feed user={user} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path="/hashtag/:hashtag" element={<HashtagPage user={user} />} />
        <Route path="/profile/:userId" element={<Profile currentUser={user} />} />
        <Route path="/edit-profile" element={user ? <EditProfile user={user} /> : <Navigate to="/login" />} />
        <Route path="/watchlist" element={user ? <Watchlist user={user} /> : <Navigate to="/login" />} />
        <Route path="/users" element={<Users currentUser={user} />} />
      </Routes>
    </Router>
  );
}

export default App;