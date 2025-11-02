# 🎰 Baccarat Simulator - Desktop Application

A professional Baccarat casino game simulator built as a standalone desktop application. Experience authentic casino gameplay with realistic betting options, card reveals, and a beautiful user interface.

![Baccarat Simulator](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### Core Gameplay
- **Authentic Baccarat Rules** - Follow official casino Baccarat rules including natural wins and third card drawing
- **Multiple Betting Options** - Player, Banker, Tie, Pairs, Bonus bets, and more
- **Realistic Card Dealing** - Cards reveal one by one with proper timing (750ms intervals)
- **Third Card Display** - Third cards appear below the first two in portrait orientation

### Enhanced Features
- **🎨 Colored Chips** - Each denomination has its own color:
  - 50 = Red
  - 100 = Blue
  - 250 = Green
  - 500 = Orange
  - 1000 = Yellow
  - 2500 = Brown
  - 5000+ = Black

- **💰 Visual Chip Stacking** - See your bets as stacked chips on the betting areas
- **🔄 Rebet Function** - Quickly place the same bets as your previous round
- **📊 Total Bet Display** - Real-time tracking of your total bet amount
- **💵 Balance Management** - Start with ₱5,000 and manage your bankroll

### Betting Options
1. **Player** (1:1 payout)
2. **Banker** (0.95:1 payout)
3. **Tie** (8:1 payout)
4. **Player Pair** (11:1 payout)
5. **Banker Pair** (11:1 payout)
6. **Perfect Pair** (25:1 payout)
7. **Player Bonus** (1-30:1 payout based on margin)
8. **Banker Bonus** (1-30:1 payout based on margin)
9. **Either Pair** (5:1 payout)

## 📥 Download & Installation

### Download the App

1. Go to the [Releases](../../releases) page
2. Download the appropriate file for your operating system:
   - **Windows**: `Baccarat-Simulator-Setup-1.0.0.exe`
   - **macOS**: `Baccarat-Simulator-1.0.0.dmg`
   - **Linux**: `Baccarat-Simulator-1.0.0.AppImage`

### Installation

#### Windows
1. Download the `.exe` file
2. Double-click to run the installer
3. Follow the installation wizard
4. Launch from Start Menu or Desktop shortcut

#### macOS
1. Download the `.dmg` file
2. Open the DMG file
3. Drag "Baccarat Simulator" to Applications folder
4. Launch from Applications or Launchpad

#### Linux
1. Download the `.AppImage` file
2. Make it executable: `chmod +x Baccarat-Simulator-*.AppImage`
3. Double-click or run: `./Baccarat-Simulator-*.AppImage`

## 🎮 How to Play

### Basic Rules
- **Objective**: Bet on which hand (Player or Banker) will have a total closest to 9
- **Card Values**:
  - Aces = 1 point
  - 2-9 = Face value
  - 10, J, Q, K = 0 points
- **Hand Value**: Sum of cards modulo 10 (e.g., 7+8=15 → value is 5)

### Playing the Game

1. **Place Your Bets**
   - Select a chip denomination
   - Click on betting areas to place bets
   - Use the REBET button to repeat your last bet

2. **Deal Cards**
   - Click the DEAL button when ready
   - Cards are dealt: Player, Banker, Player, Banker

3. **Third Card Rules**
   - Applied automatically following official Baccarat rules
   - Player draws on 0-5, stands on 6-7
   - Banker rules depend on Player's third card

4. **Winning**
   - Bets are paid according to the payout table
   - Winners are highlighted in green
   - Click NEW ROUND to play again

## 💻 Development Setup

Want to run the app from source or contribute? Follow these steps:

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/baccarat-simulator.git
cd baccarat-simulator/BaccaratSimulator

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Building from Source

```bash
# Build the web version
npm run build

# Run Electron in development
npm run electron:dev

# Build desktop executables for all platforms
npm run electron:build
```

The built applications will be in the `release/` folder.

## 🛠️ Technology Stack

- **React** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling and responsive design
- **Electron** - Desktop application wrapper
- **JavaScript** - Game logic

## 📦 Project Structure

```
BaccaratSimulator/
├── electron/           # Electron main process
│   └── main.js
├── src/               # React application source
│   ├── App.jsx        # Main game component
│   ├── main.jsx       # React entry point
│   └── index.css      # Global styles
├── public/            # Static assets
├── build/             # App icons
└── package.json       # Dependencies and scripts
```

## 🎯 System Requirements

### Minimum Requirements
- **OS**: Windows 10, macOS 10.14, or Linux (Ubuntu 18.04+)
- **RAM**: 2 GB
- **Storage**: 200 MB free space
- **Display**: 1024x768 or higher

### Recommended
- **RAM**: 4 GB or more
- **Display**: 1920x1080 or higher

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 👨‍💻 Author

Created with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Inspired by real casino Baccarat games
- Built for educational and entertainment purposes
- Not affiliated with any real casino

---

**Disclaimer**: This is a simulation for entertainment purposes only. No real money is involved. Please gamble responsibly if you choose to play with real money at licensed establishments.

