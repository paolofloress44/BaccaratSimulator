import { useState, useEffect } from 'react';

// Card Component
const Card = ({ card, revealed }) => {
  if (!revealed) {
    return (
      <div className="w-16 h-24 md:w-20 md:h-28 bg-blue-600 rounded-lg border-2 border-blue-800 shadow-lg flex items-center justify-center">
        <div className="text-white text-2xl font-bold">🂠</div>
      </div>
    );
  }

  const suitColors = {
    '♥': 'text-red-500',
    '♦': 'text-red-500',
    '♣': 'text-gray-900',
    '♠': 'text-gray-900'
  };

  return (
    <div className="w-16 h-24 md:w-20 md:h-28 bg-white rounded-lg border-2 border-gray-300 shadow-lg p-2 flex flex-col items-center justify-between">
      <div className={`text-lg md:text-xl font-bold ${suitColors[card.suit]}`}>
        {card.rank}
      </div>
      <div className={`text-3xl md:text-4xl ${suitColors[card.suit]}`}>
        {card.suit}
      </div>
      <div className={`text-lg md:text-xl font-bold ${suitColors[card.suit]}`}>
        {card.rank}
      </div>
    </div>
  );
};

// Hand Component
const Hand = ({ title, cards, revealedCount, showTotal }) => {
  const getHandValue = (cards) => {
    const sum = cards.reduce((acc, card) => {
      if (card.rank === 'A') return acc + 1;
      if (['J', 'Q', 'K'].includes(card.rank)) return acc + 0;
      if (card.rank === '10') return acc + 0;
      return acc + parseInt(card.rank);
    }, 0);
    return sum % 10;
  };

  const total = showTotal ? getHandValue(cards.slice(0, revealedCount)) : null;

  // First two cards and third card (if exists)
  const firstTwoCards = cards.slice(0, 2);
  const thirdCard = cards.length > 2 ? cards[2] : null;

  return (
    <div className="flex flex-col items-center space-y-3">
      <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
      <div className="flex flex-col items-center gap-2 md:gap-3">
        {/* First two cards horizontally */}
        <div className="flex gap-2 md:gap-3">
          {firstTwoCards.map((card, index) => (
            <Card key={index} card={card} revealed={index < revealedCount} />
          ))}
        </div>
        {/* Third card in portrait below */}
        {thirdCard && (
          <div>
            <Card card={thirdCard} revealed={revealedCount >= 3} />
          </div>
        )}
      </div>
      {showTotal && revealedCount > 0 && (
        <div className="text-2xl md:text-3xl font-bold text-yellow-400">
          Total: {total}
        </div>
      )}
    </div>
  );
};

// Helper function to get chip color based on value
const getChipColor = (value) => {
  if (value >= 50000) return 'from-gray-900 to-black';
  if (value >= 25000) return 'from-gray-900 to-black';
  if (value >= 10000) return 'from-gray-900 to-black';
  if (value >= 5000) return 'from-gray-900 to-black';
  if (value >= 2500) return 'from-amber-900 to-amber-950';
  if (value >= 1000) return 'from-yellow-400 to-yellow-600';
  if (value >= 500) return 'from-orange-500 to-orange-700';
  if (value >= 250) return 'from-green-500 to-green-700';
  if (value >= 100) return 'from-blue-500 to-blue-700';
  return 'from-red-500 to-red-700'; // 50
};

// Helper function to break down bet amount into chips
const getChipBreakdown = (amount) => {
  const chipValues = [50000, 25000, 10000, 5000, 2500, 1000, 500, 250, 100, 50];
  const chips = [];
  let remaining = amount;
  
  for (const value of chipValues) {
    while (remaining >= value) {
      chips.push(value);
      remaining -= value;
      if (chips.length >= 5) return chips; // Limit display to 5 chips
    }
  }
  
  return chips;
};

// Mini Chip Component for betting areas
const MiniChip = ({ value, index }) => {
  const colorClass = getChipColor(value);
  const offset = index * 4; // Stack offset
  
  return (
    <div 
      className={`absolute w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${colorClass} border-2 border-white shadow-md flex items-center justify-center transition-all`}
      style={{ 
        bottom: `${20 + offset}px`,
        right: `${10}px`,
        zIndex: index + 1
      }}
    >
      <span className="text-[8px] md:text-[10px] font-bold text-white">
        {value >= 1000 ? `${value/1000}k` : value}
      </span>
    </div>
  );
};

// Betting Area Component
const BettingArea = ({ title, payout, betAmount, onClick, isWinner, bgColor = 'bg-red-900' }) => {
  const chips = betAmount > 0 ? getChipBreakdown(betAmount) : [];
  
  return (
    <button
      onClick={onClick}
      className={`relative p-3 md:p-4 rounded-lg border-2 transition-all min-h-[80px] md:min-h-[100px] ${
        isWinner 
          ? 'bg-green-600 border-yellow-400 animate-pulse' 
          : betAmount > 0 
            ? `${bgColor} border-opacity-70 border-white` 
            : `${bgColor} opacity-80 border-gray-600`
      } hover:opacity-100 active:scale-95`}
    >
      <div className="text-white font-bold text-sm md:text-base text-center">
        <div>{title}</div>
        <div className="text-xs mt-1">{payout}</div>
      </div>
      {betAmount > 0 && (
        <>
          <div className="mt-1 text-yellow-400 font-bold text-xs md:text-sm">
            ₱{betAmount}
          </div>
          {chips.slice(0, 3).map((chipValue, index) => (
            <MiniChip key={index} value={chipValue} index={index} />
          ))}
        </>
      )}
    </button>
  );
};

// Chip Selector Component
const ChipSelector = ({ value, selected, onClick }) => {
  const colorClass = getChipColor(value);
  
  return (
    <button
      onClick={onClick}
      className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full font-bold text-xs md:text-sm transition-all ${
        selected
          ? `bg-gradient-to-br ${colorClass} border-4 border-yellow-300 scale-110`
          : `bg-gradient-to-br ${colorClass} border-4 border-gray-700`
      } hover:scale-105 active:scale-95 shadow-lg text-white`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-[10px] md:text-xs">₱</div>
        <div className="font-bold">{value >= 1000 ? `${value/1000}k` : value}</div>
      </div>
    </button>
  );
};

// Main App Component
function App() {
  // Game State
  const [balance, setBalance] = useState(5000);
  const [shoe, setShoe] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [bankerHand, setBankerHand] = useState([]);
  const [bets, setBets] = useState({
    player: 0,
    banker: 0,
    tie: 0,
    playerPair: 0,
    bankerPair: 0,
    playerBonus: 0,
    bankerBonus: 0,
    perfectPair: 0,
    eitherPair: 0
  });
  const [previousBets, setPreviousBets] = useState(null);
  const [gamePhase, setGamePhase] = useState('betting');
  const [selectedChip, setSelectedChip] = useState(100);
  const [message, setMessage] = useState('Place your bets!');
  const [revealedPlayerCards, setRevealedPlayerCards] = useState(0);
  const [revealedBankerCards, setRevealedBankerCards] = useState(0);
  const [winningBets, setWinningBets] = useState([]);

  const chipValues = [50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000];

  // Create and shuffle a shoe of 3 decks
  const createShoe = () => {
    const suits = ['♥', '♦', '♣', '♠'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newShoe = [];
    
    for (let deck = 0; deck < 3; deck++) {
      for (const suit of suits) {
        for (const rank of ranks) {
          newShoe.push({ suit, rank });
        }
      }
    }
    
    // Fisher-Yates shuffle
    for (let i = newShoe.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newShoe[i], newShoe[j]] = [newShoe[j], newShoe[i]];
    }
    
    return newShoe;
  };

  // Initialize shoe on mount
  useEffect(() => {
    setShoe(createShoe());
  }, []);

  // Get card value for Baccarat
  const getCardValue = (card) => {
    if (card.rank === 'A') return 1;
    if (['J', 'Q', 'K', '10'].includes(card.rank)) return 0;
    return parseInt(card.rank);
  };

  // Get hand value (last digit)
  const getHandValue = (hand) => {
    const sum = hand.reduce((acc, card) => acc + getCardValue(card), 0);
    return sum % 10;
  };

  // Check if hand is natural (8 or 9)
  const checkNatural = (hand) => {
    if (hand.length !== 2) return false;
    const value = getHandValue(hand);
    return value === 8 || value === 9;
  };

  // Check if cards form a pair
  const isPair = (cards) => {
    return cards.length >= 2 && cards[0].rank === cards[1].rank;
  };

  // Check if cards form a perfect pair (same suit)
  const isPerfectPair = (cards) => {
    return cards.length >= 2 && cards[0].rank === cards[1].rank && cards[0].suit === cards[1].suit;
  };

  // Handle placing bets
  const placeBet = (betType) => {
    if (gamePhase !== 'betting') return;
    if (balance < selectedChip) {
      setMessage('Insufficient balance!');
      return;
    }

    const totalCurrentBets = Object.values(bets).reduce((a, b) => a + b, 0);
    if (totalCurrentBets + selectedChip > balance) {
      setMessage('Not enough balance for this bet!');
      return;
    }

    setBets(prev => ({
      ...prev,
      [betType]: prev[betType] + selectedChip
    }));
    setMessage(`₱${selectedChip} bet placed on ${betType}!`);
  };

  // Handle rebet button
  const handleRebet = () => {
    if (!previousBets) {
      setMessage('No previous bets to repeat!');
      return;
    }

    const totalPreviousBets = Object.values(previousBets).reduce((a, b) => a + b, 0);
    if (totalPreviousBets > balance) {
      setMessage('Insufficient balance for rebet!');
      return;
    }

    setBets({...previousBets});
    setMessage(`Rebet placed: ₱${totalPreviousBets}`);
  };

  // Handle deal button
  const handleDeal = () => {
    const totalBets = Object.values(bets).reduce((a, b) => a + b, 0);
    if (totalBets === 0) {
      setMessage('Please place at least one bet!');
      return;
    }

    // Save current bets as previous bets
    setPreviousBets({...bets});

    // Deduct bets from balance
    setBalance(prev => prev - totalBets);
    
    // Check if we need to reshuffle
    if (shoe.length < 6) {
      setMessage('Shuffling new shoe...');
      setShoe(createShoe());
      setTimeout(() => dealInitialCards(), 1000);
    } else {
      dealInitialCards();
    }
  };

  // Deal initial 4 cards
  const dealInitialCards = () => {
    setGamePhase('dealing');
    setMessage('Dealing cards...');
    setRevealedPlayerCards(0);
    setRevealedBankerCards(0);

    const newShoe = [...shoe];
    const newPlayerHand = [newShoe.pop(), newShoe.pop()];
    const newBankerHand = [newShoe.pop(), newShoe.pop()];

    // Deal in order: P, B, P, B
    setPlayerHand([newPlayerHand[0]]);
    setBankerHand([newBankerHand[0]]);
    
    setTimeout(() => {
      setPlayerHand([newPlayerHand[0], newPlayerHand[1]]);
      setBankerHand([newBankerHand[0], newBankerHand[1]]);
      setShoe(newShoe);
      setGamePhase('revealing');
    }, 500);
  };

  // Revealing phase - reveal cards one by one
  useEffect(() => {
    if (gamePhase !== 'revealing') return;

    const revealSequence = async () => {
      setRevealedPlayerCards(1);
      await new Promise(resolve => setTimeout(resolve, 750));
      
      setRevealedBankerCards(1);
      await new Promise(resolve => setTimeout(resolve, 750));
      
      setRevealedPlayerCards(2);
      await new Promise(resolve => setTimeout(resolve, 750));
      
      setRevealedBankerCards(2);
      await new Promise(resolve => setTimeout(resolve, 750));

      // Check for naturals
      if (checkNatural(playerHand) || checkNatural(bankerHand)) {
        setMessage('Natural! No more cards drawn.');
        setTimeout(() => setGamePhase('payout'), 1000);
      } else {
        setGamePhase('drawing');
      }
    };

    revealSequence();
  }, [gamePhase]);

  // Drawing phase - apply third card rules
  useEffect(() => {
    if (gamePhase !== 'drawing') return;

    const applyThirdCardRules = async () => {
      const playerValue = getHandValue(playerHand);
      const bankerValue = getHandValue(bankerHand);
      
      let newPlayerHand = [...playerHand];
      let newBankerHand = [...bankerHand];
      let newShoe = [...shoe];
      let playerDrewThird = false;
      let playerThirdCardValue = null;

      // Player's third card rule
      if (playerValue <= 5) {
        setMessage('Player draws a third card...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const thirdCard = newShoe.pop();
        newPlayerHand.push(thirdCard);
        setPlayerHand(newPlayerHand);
        setRevealedPlayerCards(3);
        playerDrewThird = true;
        playerThirdCardValue = getCardValue(thirdCard);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        setMessage('Player stands.');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Banker's third card rule
      let bankerDraws = false;
      
      if (!playerDrewThird) {
        // If player stood, banker follows same rule
        bankerDraws = bankerValue <= 5;
      } else {
        // Complex banker rules based on player's third card
        if (bankerValue <= 2) {
          bankerDraws = true;
        } else if (bankerValue === 3) {
          bankerDraws = playerThirdCardValue !== 8;
        } else if (bankerValue === 4) {
          bankerDraws = [2, 3, 4, 5, 6, 7].includes(playerThirdCardValue);
        } else if (bankerValue === 5) {
          bankerDraws = [4, 5, 6, 7].includes(playerThirdCardValue);
        } else if (bankerValue === 6) {
          bankerDraws = [6, 7].includes(playerThirdCardValue);
        }
      }

      if (bankerDraws) {
        setMessage('Banker draws a third card...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const thirdCard = newShoe.pop();
        newBankerHand.push(thirdCard);
        setBankerHand(newBankerHand);
        setRevealedBankerCards(3);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        setMessage('Banker stands.');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setShoe(newShoe);
      setGamePhase('payout');
    };

    applyThirdCardRules();
  }, [gamePhase]);

  // Payout phase - calculate winnings
  useEffect(() => {
    if (gamePhase !== 'payout') return;

    const calculatePayouts = () => {
      const playerValue = getHandValue(playerHand);
      const bankerValue = getHandValue(bankerHand);
      const totalCards = playerHand.length + bankerHand.length;
      
      let winnings = 0;
      const winners = [];
      let resultMessage = '';

      // Determine winner
      if (playerValue > bankerValue) {
        resultMessage = `Player wins with ${playerValue}!`;
        if (bets.player > 0) {
          winnings += bets.player * 2; // 1:1 payout
          winners.push('player');
        }
      } else if (bankerValue > playerValue) {
        resultMessage = `Banker wins with ${bankerValue}!`;
        if (bets.banker > 0) {
          winnings += bets.banker * 1.95; // 0.95:1 payout
          winners.push('banker');
        }
      } else {
        resultMessage = `Tie! Both at ${playerValue}`;
        // Return main bets
        winnings += bets.player + bets.banker;
        if (bets.tie > 0) {
          winnings += bets.tie * 9; // 8:1 payout
          winners.push('tie');
        }
      }

      // Check pair bets
      const playerHasPair = isPair(playerHand);
      const bankerHasPair = isPair(bankerHand);

      if (playerHasPair) {
        if (isPerfectPair(playerHand)) {
          if (bets.perfectPair > 0) {
            winnings += bets.perfectPair * 26; // 25:1 payout
            winners.push('perfectPair');
          }
        }
        if (bets.playerPair > 0) {
          winnings += bets.playerPair * 12; // 11:1 payout
          winners.push('playerPair');
        }
      }

      if (bankerHasPair) {
        if (isPerfectPair(bankerHand) && !winners.includes('perfectPair')) {
          if (bets.perfectPair > 0) {
            winnings += bets.perfectPair * 26;
            winners.push('perfectPair');
          }
        }
        if (bets.bankerPair > 0) {
          winnings += bets.bankerPair * 12;
          winners.push('bankerPair');
        }
      }

      // Check either pair (wins if either hand has a pair)
      if ((playerHasPair || bankerHasPair) && bets.eitherPair > 0) {
        winnings += bets.eitherPair * 6; // 5:1 payout
        winners.push('eitherPair');
      }

      // Check player bonus (wins with natural 8 or 9, or winning by 4+ points)
      if (playerValue > bankerValue) {
        const margin = playerValue - bankerValue;
        if (playerValue >= 8 || margin >= 4) {
          if (bets.playerBonus > 0) {
            const multiplier = playerValue === 9 ? 31 : playerValue === 8 ? 11 : margin >= 4 ? 2 : 1;
            winnings += bets.playerBonus * multiplier;
            winners.push('playerBonus');
          }
        }
      }

      // Check banker bonus (wins with natural 8 or 9, or winning by 4+ points)
      if (bankerValue > playerValue) {
        const margin = bankerValue - playerValue;
        if (bankerValue >= 8 || margin >= 4) {
          if (bets.bankerBonus > 0) {
            const multiplier = bankerValue === 9 ? 31 : bankerValue === 8 ? 11 : margin >= 4 ? 2 : 1;
            winnings += bets.bankerBonus * multiplier;
            winners.push('bankerBonus');
          }
        }
      }

      setWinningBets(winners);
      const newBalance = balance + winnings;
      setBalance(newBalance);

      if (winnings > 0) {
        setMessage(`${resultMessage} You won ₱${Math.floor(winnings)}!`);
      } else {
        setMessage(`${resultMessage} Better luck next time!`);
      }

      // Check if balance is 0
      if (newBalance === 0) {
        setTimeout(() => {
          setBalance(5000);
          setMessage('Out of funds! Resetting to ₱5000.');
          setGamePhase('betting');
        }, 3000);
      }
    };

    calculatePayouts();
  }, [gamePhase]);

  // Clear bets and start new round
  const handleNewRound = () => {
    setBets({
      player: 0,
      banker: 0,
      tie: 0,
      playerPair: 0,
      bankerPair: 0,
      playerBonus: 0,
      bankerBonus: 0,
      perfectPair: 0,
      eitherPair: 0
    });
    setPlayerHand([]);
    setBankerHand([]);
    setRevealedPlayerCards(0);
    setRevealedBankerCards(0);
    setWinningBets([]);
    setGamePhase('betting');
    setMessage('Place your bets!');
  };

  // Restart game
  const handleRestart = () => {
    setBalance(5000);
    setShoe(createShoe());
    handleNewRound();
    setMessage('Game restarted! Good luck!');
  };

  // Calculate total bet
  const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-4 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                Baccarat
              </h1>
              <div className="text-lg md:text-xl text-white flex gap-6">
                <div>
                  Balance: <span className="text-green-400 font-bold">₱{balance}</span>
                </div>
                <div>
                  Total Bet: <span className="text-yellow-400 font-bold">₱{totalBet}</span>
                </div>
              </div>
              <div className="text-sm md:text-base text-gray-400">
                Cards in shoe: {shoe.length}
              </div>
            </div>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Restart Game
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-green-800 rounded-lg p-4 md:p-8 mb-4 shadow-xl border-8 border-yellow-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
            <Hand 
              title="PLAYER" 
              cards={playerHand} 
              revealedCount={revealedPlayerCards}
              showTotal={revealedPlayerCards > 0}
            />
            <Hand 
              title="BANKER" 
              cards={bankerHand} 
              revealedCount={revealedBankerCards}
              showTotal={revealedBankerCards > 0}
            />
          </div>

          {/* Status Message */}
          <div className="text-center text-xl md:text-2xl font-bold text-yellow-300 bg-gray-900 bg-opacity-50 rounded-lg p-4">
            {message}
          </div>
        </div>

        {/* Betting Area */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-4 shadow-xl">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">
            Place Your Bets
          </h2>
          
          {/* Professional Baccarat Table Layout */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {/* Top Row - Pair Bets */}
            <div className="col-span-4 flex">
              <div style={{ flex: '0 0 calc(25% - 6px)' }}>
                <BettingArea 
                  title="P PAIR" 
                  payout="11:1"
                  betAmount={bets.playerPair}
                  onClick={() => placeBet('playerPair')}
                  isWinner={winningBets.includes('playerPair')}
                  bgColor="bg-blue-800"
                />
              </div>
              <div style={{ flex: '1' }}></div>
              <div style={{ flex: '0 0 calc(25% - 6px)' }}>
                <BettingArea 
                  title="B PAIR" 
                  payout="11:1"
                  betAmount={bets.bankerPair}
                  onClick={() => placeBet('bankerPair')}
                  isWinner={winningBets.includes('bankerPair')}
                  bgColor="bg-red-800"
                />
              </div>
            </div>

            {/* Main Betting Row */}
            <div className="col-span-1 flex flex-col gap-3">
              <BettingArea 
                title="P BONUS" 
                payout="1-30:1"
                betAmount={bets.playerBonus}
                onClick={() => placeBet('playerBonus')}
                isWinner={winningBets.includes('playerBonus')}
                bgColor="bg-blue-900"
              />
              <BettingArea 
                title="PERFECT PAIR" 
                payout="25:1"
                betAmount={bets.perfectPair}
                onClick={() => placeBet('perfectPair')}
                isWinner={winningBets.includes('perfectPair')}
                bgColor="bg-amber-900"
              />
            </div>

            {/* Center - Main Bets */}
            <div className="col-span-2 grid grid-cols-3 gap-2">
              <BettingArea 
                title="PLAYER" 
                payout="1:1"
                betAmount={bets.player}
                onClick={() => placeBet('player')}
                isWinner={winningBets.includes('player')}
                bgColor="bg-blue-700"
              />
              <BettingArea 
                title="TIE" 
                payout="8:1"
                betAmount={bets.tie}
                onClick={() => placeBet('tie')}
                isWinner={winningBets.includes('tie')}
                bgColor="bg-green-700"
              />
              <BettingArea 
                title="BANKER" 
                payout="0.95:1"
                betAmount={bets.banker}
                onClick={() => placeBet('banker')}
                isWinner={winningBets.includes('banker')}
                bgColor="bg-red-700"
              />
            </div>

            <div className="col-span-1 flex flex-col gap-3">
              <BettingArea 
                title="B BONUS" 
                payout="1-30:1"
                betAmount={bets.bankerBonus}
                onClick={() => placeBet('bankerBonus')}
                isWinner={winningBets.includes('bankerBonus')}
                bgColor="bg-red-900"
              />
              <BettingArea 
                title="EITHER PAIR" 
                payout="5:1"
                betAmount={bets.eitherPair}
                onClick={() => placeBet('eitherPair')}
                isWinner={winningBets.includes('eitherPair')}
                bgColor="bg-amber-950"
              />
            </div>
          </div>

          {/* Chip Selector */}
          <div className="mb-6">
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 text-center">
              Select Chip
            </h3>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {chipValues.map(value => (
                <ChipSelector
                  key={value}
                  value={value}
                  selected={selectedChip === value}
                  onClick={() => setSelectedChip(value)}
                />
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
            {gamePhase === 'betting' && (
              <>
                <button
                  onClick={handleRebet}
                  disabled={!previousBets}
                  className="px-8 py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xl font-bold rounded-lg transition-all active:scale-95 shadow-lg"
                >
                  REBET
                </button>
                <button
                  onClick={handleDeal}
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg transition-all active:scale-95 shadow-lg"
                >
                  DEAL
                </button>
              </>
            )}
            {gamePhase === 'payout' && (
              <button
                onClick={handleNewRound}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-lg transition-all active:scale-95 shadow-lg"
              >
                NEW ROUND
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Baccarat Game Simulator • Play Responsibly</p>
        </div>
      </div>
    </div>
  );
}

export default App;

