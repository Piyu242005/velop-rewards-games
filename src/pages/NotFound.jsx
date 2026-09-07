// 404 Not Found page
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Page Not Found');
  return (
    <div style={{
      minHeight: '100vh',
      background: '#161827',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1.5rem',
      fontFamily: '-apple-system, "Segoe UI", system-ui, sans-serif',
      color: '#f0f1f5',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '3rem', fontWeight: 700, color: '#d63a3a' }}>404</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Page not found</h1>
      <p style={{ color: '#8b8fa8', margin: 0 }}>That page doesn't exist in the VELOOP Games universe.</p>
      <Link
        to="/games"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: '44px',
          padding: '0 2rem',
          background: '#d63a3a',
          color: '#fff',
          borderRadius: '10px',
          textDecoration: 'none',
          fontSize: '0.95rem',
          fontWeight: 600,
        }}
      >
        ← Back to Games
      </Link>
    </div>
  );
}
