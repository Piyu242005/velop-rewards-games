// ============================================================
// VELOOP Rewards Games — Game Data
// ============================================================

// Public assets must include Vite's base path so they work on
// GitHub Pages (/velop-rewards-games/) as well as local hosting.
const img = (filename) => `${import.meta.env.BASE_URL}assets/games/${filename}`;

const gamesData = [
  { id: 1, slug: 'space-shooter', name: 'Space Shooter', tagline: 'Blast your way through the cosmos', image: img('01-space-shooter.avif'), entryCost: 20, category: 'Action', route: '/games/space-shooter', playable: true,
    guide: ['Tap or click to shoot incoming enemies.', 'Dodge asteroids — they cost you a life.', 'Destroy wave bosses to earn bonus coins.', 'Survive as long as possible to maximise your score.', 'Your score converts to Game Coins at the end.'] },
  { id: 2, slug: 'fruit-blast', name: 'Fruit Blast', tagline: 'Match, blast and earn big', image: img('02-fruit-blast.avif'), entryCost: 20, category: 'Casual', route: '/games/fruit-blast', playable: true,
    guide: ['Click or tap a group of 2+ matching fruits to blast them.', 'Larger groups score bigger multipliers.', 'Clear the board or reach the target score to win the round.', 'You get 3 lives — use them wisely.', 'Every 500 points earns you 1 Game Coin.'] },
  { id: 3, slug: 'puzzle-match', name: 'Puzzle Match', tagline: 'Sharpen your mind, win coins', image: img('03-puzzle-match.avif'), entryCost: 20, category: 'Puzzle', route: '/games/puzzle-match', playable: false, guide: [] },
  { id: 4, slug: 'cricket-champ', name: 'Cricket Champ', tagline: 'Hit sixes, rule the pitch', image: img('04-cricket-champ.avif'), entryCost: 20, category: 'Sports', route: '/games/cricket-champ', playable: false, guide: [] },
  { id: 5, slug: 'car-rush', name: 'Car Rush', tagline: 'Dodge traffic at breakneck speed', image: img('05-car-rush.avif'), entryCost: 20, category: 'Racing', route: '/games/car-rush', playable: false, guide: [] },
  { id: 6, slug: 'bubble-pop', name: 'Bubble Pop', tagline: 'Pop bubbles, pocket rewards', image: img('06-bubble-pop.avif'), entryCost: 20, category: 'Casual', route: '/games/bubble-pop', playable: false, guide: [] },
  { id: 7, slug: 'memory-flip', name: 'Memory Flip', tagline: 'Test your recall, earn every flip', image: img('07-memory-flip.avif'), entryCost: 20, category: 'Puzzle', route: '/games/memory-flip', playable: false, guide: [] },
  { id: 8, slug: 'ninja-run', name: 'Ninja Run', tagline: 'Run, slash and survive', image: img('08-ninja-run.avif'), entryCost: 20, category: 'Action', route: '/games/ninja-run', playable: false, guide: [] },
  { id: 9, slug: 'treasure-hunt', name: 'Treasure Hunt', tagline: 'Seek the vault, claim the gold', image: img('09-treasure-hunt.avif'), entryCost: 20, category: 'Adventure', route: '/games/treasure-hunt', playable: false, guide: [] },
  { id: 10, slug: 'word-arena', name: 'Word Arena', tagline: 'Spell fast, climb higher', image: img('10-word-arena.avif'), entryCost: 20, category: 'Word', route: '/games/word-arena', playable: false, guide: [] },
  { id: 11, slug: 'quiz-master', name: 'Quiz Master', tagline: 'Answer right, win the night', image: img('11-quiz-master.avif'), entryCost: 20, category: 'Trivia', route: '/games/quiz-master', playable: false, guide: [] },
  { id: 12, slug: 'basketball-pro', name: 'Basketball Pro', tagline: 'Shoot hoops, score coins', image: img('12-basketball-pro.avif'), entryCost: 20, category: 'Sports', route: '/games/basketball-pro', playable: false, guide: [] },
  { id: 13, slug: 'aqua-escape', name: 'Aqua Escape', tagline: 'Dive deep, escape the current', image: img('13-aqua-escape.avif'), entryCost: 20, category: 'Adventure', route: '/games/aqua-escape', playable: false, guide: [] },
];

export function getGameBySlug(slug) {
  return gamesData.find((g) => g.slug === slug) ?? null;
}

export default gamesData;
