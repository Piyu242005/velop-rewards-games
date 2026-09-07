import { Component } from 'react';

// ============================================================
// ErrorBoundary — catches runtime errors in any child tree
// and shows a friendly recovery UI instead of a blank page.
// ============================================================

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Would send to monitoring service in production
    console.error('[VELOOP ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1.5rem',
        background: '#161827',
        color: '#f0f1f5',
        fontFamily: '-apple-system, "Segoe UI", system-ui, sans-serif',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem' }}>⚠️</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Something went wrong</h1>
        <p style={{ color: '#8b8fa8', fontSize: '0.95rem', margin: 0, maxWidth: '420px' }}>
          An unexpected error occurred. Your progress has been saved.
          Please reload the page to continue.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            height: '44px',
            padding: '0 2rem',
            background: '#d63a3a',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reload
        </button>
        {import.meta.env.DEV && this.state.error && (
          <pre style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: '#f87171',
            maxWidth: '600px',
            textAlign: 'left',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          }}>
            {this.state.error.toString()}
          </pre>
        )}
      </div>
    );
  }
}
