import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
// HashRouter keeps routing client-side — required for GitHub Pages
// which can't rewrite URLs to index.html on the server side.
import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameCoinProvider } from './context/GameCoinContext';
import { TokenProvider }    from './context/TokenContext';
import ErrorBoundary        from './components/common/ErrorBoundary';

// Pages
import Games          from './pages/Games';
import GameHome       from './pages/GameHome';
import GameGuidePage  from './pages/GameGuidePage';
import GameRewardPage from './pages/GameRewardPage';
import GameRedeem     from './pages/GameRedeem';
import NotFound       from './pages/NotFound';

// Game environments
import SpaceShooter from './games/GameOne/Game';
import FruitBlast   from './games/GameTwo/Game';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <TokenProvider>
          <GameCoinProvider>
            {/* Skip-to-main for keyboard / screen-reader users */}
            <a href="#main-content" className="vg-skip-nav">Skip to content</a>

            <Routes>
              {/* Hub */}
              <Route path="/"      element={<Navigate to="/games" replace />} />
              <Route path="/games" element={<Games />} />

              {/* Per-game landing — all 13 games */}
              <Route path="/games/:slug/home"   element={<GameHome />} />
              <Route path="/games/:slug/guide"  element={<GameGuidePage />} />
              <Route path="/games/:slug/reward" element={<GameRewardPage />} />

              {/* Playable game environments */}
              <Route path="/games/space-shooter/play" element={<SpaceShooter />} />
              <Route path="/games/fruit-blast/play"   element={<FruitBlast />} />

              {/* Redemption */}
              <Route path="/redeem" element={<GameRedeem />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GameCoinProvider>
        </TokenProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
