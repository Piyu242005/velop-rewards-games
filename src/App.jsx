import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameCoinProvider } from './context/GameCoinContext';

// Pages
import Games      from './pages/Games';
import GameHome   from './pages/GameHome';
import GameRedeem from './pages/GameRedeem';

// Game environments
import GameOne from './games/GameOne/Game';
import GameTwo from './games/GameTwo/Game';

export default function App() {
  return (
    <BrowserRouter>
      <GameCoinProvider>
        <Routes>
          {/* Hub */}
          <Route path="/"       element={<Navigate to="/games" replace />} />
          <Route path="/games"  element={<Games />} />

          {/* Individual game home (by id) */}
          <Route path="/games/:id/home" element={<GameHome />} />

          {/* Playable game environments */}
          <Route path="/games/space-shooter/*" element={<GameOne />} />
          <Route path="/games/fruit-blast/*"   element={<GameTwo />} />

          {/* Redemption */}
          <Route path="/redeem" element={<GameRedeem />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/games" replace />} />
        </Routes>
      </GameCoinProvider>
    </BrowserRouter>
  );
}
