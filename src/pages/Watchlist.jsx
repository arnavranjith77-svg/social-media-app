import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Watchlist({ user }) {
  const [watchlist, setWatchlist] = useState([]);
  const [stockSymbol, setStockSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock stock data (replace with real API later)
  const getStockPrice = (symbol) => {
    const mockPrices = {
      'AAPL': { price: 175.43, change: 2.34, changePercent: 1.35 },
      'GOOGL': { price: 142.56, change: -1.23, changePercent: -0.86 },
      'MSFT': { price: 378.91, change: 5.67, changePercent: 1.52 },
      'TSLA': { price: 248.42, change: -3.45, changePercent: -1.37 },
      'AMZN': { price: 178.35, change: 0.87, changePercent: 0.49 },
      'META': { price: 484.03, change: 8.92, changePercent: 1.88 },
      'NVDA': { price: 875.28, change: 12.45, changePercent: 1.44 },
      'AMD': { price: 163.72, change: -2.18, changePercent: -1.31 }
    };
    
    return mockPrices[symbol.toUpperCase()] || { price: 100.00, change: 0, changePercent: 0 };
  };

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'watchlist'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stocks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        ...getStockPrice(doc.data().symbol)
      }));
      setWatchlist(stocks);
    });

    return unsubscribe;
  }, [user]);

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!stockSymbol.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Check if stock already in watchlist
      const exists = watchlist.find(s => s.symbol.toUpperCase() === stockSymbol.toUpperCase());
      if (exists) {
        setError('Stock already in watchlist');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'watchlist'), {
        userId: user.uid,
        symbol: stockSymbol.toUpperCase(),
        addedAt: new Date()
      });

      setStockSymbol('');
    } catch (error) {
      setError('Error adding stock: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStock = async (id) => {
    try {
      await deleteDoc(doc(db, 'watchlist', id));
    } catch (error) {
      console.error('Error removing stock:', error);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        Please log in to view your watchlist
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#1f2937', marginBottom: '24px', fontSize: '32px', fontWeight: 'bold' }}>
        📊 Stock Watchlist
      </h1>

      {/* Add Stock Form */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        border: '1px solid #e5e7eb'
      }}>
        <form onSubmit={handleAddStock} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              textTransform: 'uppercase'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Adding...' : '+ Add Stock'}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '12px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: '12px', fontSize: '12px', color: '#9ca3af' }}>
          Available: AAPL, GOOGL, MSFT, TSLA, AMZN, META, NVDA, AMD
        </div>
      </div>

      {/* Watchlist */}
      {watchlist.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>📈 Your watchlist is empty</p>
          <p style={{ fontSize: '14px' }}>Add stocks to start tracking</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {watchlist.map((stock) => (
            <div
              key={stock.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                  {stock.symbol}
                </h3>
                <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                  Added {stock.addedAt?.toDate?.()?.toLocaleDateString?.()}
                </p>
              </div>

              <div style={{ textAlign: 'right', marginRight: '20px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  ${stock.price.toFixed(2)}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: stock.change >= 0 ? '#16a34a' : '#dc2626'
                }}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </div>
              </div>

              <button
                onClick={() => handleRemoveStock(stock.id)}
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total Portfolio Value */}
      {watchlist.length > 0 && (
        <div style={{
          marginTop: '20px',
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
            Total Stocks Tracked:
          </span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
            {watchlist.length}
          </span>
        </div>
      )}
    </div>
  );
}
