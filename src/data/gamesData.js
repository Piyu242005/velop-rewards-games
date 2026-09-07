// ============================================================
// VELOOP Rewards Games — Game Data
// ============================================================
//
// Each entry describes one game shown in the carousel.
// Only games with  playable: true  will route to a live game.
// ============================================================

// Resolve game artwork from the assets folder
const img = (filename) => `/assets/games/${filename}`;

const gamesData = [
  {
    id: 1,
    name: 'Space Shooter',
    tagline: 'Blast your way through the cosmos',
    image: img('01-space-shooter.png'),
    entryCost: 20,
    category: 'Action',
    route: '/games/space-shooter',
    playable: true,           // Game One — will be fully implemented
  },
  {
    id: 2,
    name: 'Fruit Blast',
    tagline: 'Match, blast and earn big',
    image: img('02-fruit-blast.png'),
    entryCost: 20,
    category: 'Casual',
    route: '/games/fruit-blast',
    playable: true,           // Game Two — will be fully implemented
  },
  {
    id: 3,
    name: 'Puzzle Match',
    tagline: 'Sharpen your mind, win coins',
    image: img('03-puzzle-match.png'),
    entryCost: 20,
    category: 'Puzzle',
    route: '/games/puzzle-match',
    playable: false,
  },
  {
    id: 4,
    name: 'Cricket Champ',
    tagline: 'Hit sixes, rule the pitch',
    image: img('04-cricket-champ.png'),
    entryCost: 20,
    category: 'Sports',
    route: '/games/cricket-champ',
    playable: false,
  },
  {
    id: 5,
    name: 'Car Rush',
    tagline: 'Dodge traffic at breakneck speed',
    image: img('05-car-rush.png'),
    entryCost: 20,
    category: 'Racing',
    route: '/games/car-rush',
    playable: false,
  },
  {
    id: 6,
    name: 'Bubble Pop',
    tagline: 'Pop bubbles, pocket rewards',
    image: img('06-bubble-pop.png'),
    entryCost: 20,
    category: 'Casual',
    route: '/games/bubble-pop',
    playable: false,
  },
  {
    id: 7,
    name: 'Memory Flip',
    tagline: 'Test your recall, earn every flip',
    image: img('07-memory-flip.png'),
    entryCost: 20,
    category: 'Puzzle',
    route: '/games/memory-flip',
    playable: false,
  },
  {
    id: 8,
    name: 'Ninja Run',
    tagline: 'Run, slash and survive',
    image: img('08-ninja-run.png'),
    entryCost: 20,
    category: 'Action',
    route: '/games/ninja-run',
    playable: false,
  },
  {
    id: 9,
    name: 'Treasure Hunt',
    tagline: 'Seek the vault, claim the gold',
    image: img('09-treasure-hunt.png'),
    entryCost: 20,
    category: 'Adventure',
    route: '/games/treasure-hunt',
    playable: false,
  },
  {
    id: 10,
    name: 'Word Arena',
    tagline: 'Spell fast, climb higher',
    image: img('10-word-arena.png'),
    entryCost: 20,
    category: 'Word',
    route: '/games/word-arena',
    playable: false,
  },
  {
    id: 11,
    name: 'Quiz Master',
    tagline: 'Answer right, win the night',
    image: img('11-quiz-master.png'),
    entryCost: 20,
    category: 'Trivia',
    route: '/games/quiz-master',
    playable: false,
  },
  {
    id: 12,
    name: 'Basketball Pro',
    tagline: 'Shoot hoops, score coins',
    image: img('12-basketball-pro.png'),
    entryCost: 20,
    category: 'Sports',
    route: '/games/basketball-pro',
    playable: false,
  },
  {
    id: 13,
    name: 'Aqua Escape',
    tagline: 'Dive deep, escape the current',
    image: img('13-aqua-escape.png'),
    entryCost: 20,
    category: 'Adventure',
    route: '/games/aqua-escape',
    playable: false,
  },
];

export default gamesData;
