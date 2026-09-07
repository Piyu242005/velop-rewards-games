import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import './styles/global.css';

// Keep the bootstrap layer outside the router so startup errors are caught
// instead of leaving GitHub Pages on a blank white screen.
const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = `
    <main style="min-height:100vh;display:grid;place-items:center;background:#161827;color:#f0f1f5;font-family:system-ui,sans-serif;padding:24px;text-align:center">
      <section>
        <h1>VELOOP Rewards Games</h1>
        <p>Application root could not be initialized.</p>
        <button onclick="location.reload()" style="margin-top:16px;padding:10px 18px;border:0;border-radius:10px;background:#d63a3a;color:#fff;font-weight:600;cursor:pointer">Reload</button>
      </section>
    </main>`;
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
