import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  if (value >= 50000) return 'from-cyan-400 to-cyan-600';      // 50k+ = Cyan
  if (value >= 25000) return 'from-pink-500 to-pink-700';      // 25k = Pink
  if (value >= 10000) return 'from-purple-500 to-purple-700';  // 10k = Purple
  if (value >= 5000) return 'from-gray-900 to-black';          // 5k = Black
  if (value >= 2500) return 'from-amber-900 to-amber-950';     // 2.5k = Brown
  if (value >= 1000) return 'from-yellow-400 to-yellow-600';   // 1k = Yellow
  if (value >= 500) return 'from-orange-500 to-orange-700';    // 500 = Orange
  if (value >= 250) return 'from-green-500 to-green-700';      // 250 = Green
  if (value >= 100) return 'from-blue-500 to-blue-700';        // 100 = Blue
  return 'from-red-500 to-red-700';                            // 50 = Red
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
const BettingArea = ({ title, payout, betAmount, onClick, isWinner, bgColor = 'bg-red-900', onMouseEnter, onMouseLeave }) => {
  const chips = betAmount > 0 ? getChipBreakdown(betAmount) : [];
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onToggle, label, disabled = false }) => {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm font-medium ${disabled ? 'text-gray-500' : 'text-white'}`}>{label}</span>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          disabled 
            ? 'bg-gray-700 cursor-not-allowed opacity-50'
            : enabled 
              ? 'bg-green-500' 
              : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

// Helper function to predict next Big Road entry
const predictNextBigRoadEntry = (bigRoadData, outcome) => {
  if (bigRoadData.length === 0) {
    return { outcome, entries: ['win'], isNewColumn: true };
  }
  
  const lastEntry = bigRoadData[bigRoadData.length - 1];
  if (lastEntry.outcome === outcome) {
    // Same outcome - extend current column
    return { outcome, entries: [...lastEntry.entries, 'win'], isNewColumn: false };
  } else {
    // Different outcome - new column
    return { outcome, entries: ['win'], isNewColumn: true };
  }
};

// Helper function to calculate derivative road by comparing Big Road column heights
const calculateDerivativeRoadFromColumns = (bigRoadData, lookbackDistance) => {
  const minColumns = lookbackDistance + 1;
  if (bigRoadData.length < minColumns) return [];
  
  const colors = [];
  
  // Start from the column at position (lookbackDistance), compare with column X-lookbackDistance
  // Process ALL columns, including those with more than 6 entries
  for (let colIndex = lookbackDistance; colIndex < bigRoadData.length; colIndex++) {
    const currentColumn = bigRoadData[colIndex];
    const compareColumn = bigRoadData[colIndex - lookbackDistance];
    
    // Compare heights (number of entries in each column) - use full count, not display limit
    const currentHeight = currentColumn.entries.length;
    const compareHeight = compareColumn.entries.length;
    
    // Same height = Red (Banker color), Different = Blue (Player color)
    const color = currentHeight === compareHeight ? 'red' : 'blue';
    colors.push(color);
  }
  
  // Convert color sequence into columns (same color = go down, different = new column)
  const columns = [];
  let currentColumn = null;
  
  colors.forEach(color => {
    if (!currentColumn || currentColumn.color !== color) {
      // Different color = start new column
      currentColumn = { color, count: 1 };
      columns.push(currentColumn);
    } else {
      // Same color = extend current column (go down) - no limit on count
      currentColumn.count++;
    }
  });
  
  return columns;
};

// Helper function to predict Small Road color
const predictSmallRoadColor = (bigRoadData, outcome) => {
  if (bigRoadData.length < 2) return null;
  
  // Simulate adding the prediction to Big Road
  const predictedEntry = predictNextBigRoadEntry(bigRoadData, outcome);
  let simulatedBigRoad;
  
  if (predictedEntry.isNewColumn) {
    // New column
    simulatedBigRoad = [...bigRoadData, predictedEntry];
  } else {
    // Extend existing column
    simulatedBigRoad = [...bigRoadData];
    simulatedBigRoad[simulatedBigRoad.length - 1] = predictedEntry;
  }
  
  // Need at least 3 columns for Small Road (compare X with X-2)
  if (simulatedBigRoad.length < 3) return null;
  
  // Get the last column and compare with column 2 positions back
  const lastCol = simulatedBigRoad[simulatedBigRoad.length - 1];
  const compareCol = simulatedBigRoad[simulatedBigRoad.length - 3];
  
  return lastCol.entries.length === compareCol.entries.length ? 'red' : 'blue';
};

// Helper function to predict Cockroach Road color
const predictCockroachRoadColor = (bigRoadData, outcome) => {
  if (bigRoadData.length < 3) return null;
  
  // Simulate adding the prediction to Big Road
  const predictedEntry = predictNextBigRoadEntry(bigRoadData, outcome);
  let simulatedBigRoad;
  
  if (predictedEntry.isNewColumn) {
    // New column
    simulatedBigRoad = [...bigRoadData, predictedEntry];
  } else {
    // Extend existing column
    simulatedBigRoad = [...bigRoadData];
    simulatedBigRoad[simulatedBigRoad.length - 1] = predictedEntry;
  }
  
  // Need at least 4 columns for Cockroach Road (compare X with X-3)
  if (simulatedBigRoad.length < 4) return null;
  
  // Get the last column and compare with column 3 positions back
  const lastCol = simulatedBigRoad[simulatedBigRoad.length - 1];
  const compareCol = simulatedBigRoad[simulatedBigRoad.length - 4];
  
  return lastCol.entries.length === compareCol.entries.length ? 'red' : 'blue';
};

// Helper function to calculate Small Road (as columns)
// Small Road starts at Big Road column 3, compares column X with X-2
const calculateSmallRoad = (bigRoadData) => {
  return calculateDerivativeRoadFromColumns(bigRoadData, 2);
};

// Helper function to calculate Cockroach Road (as columns)
// Cockroach Road starts at Big Road column 4, compares column X with X-3
const calculateCockroachRoad = (bigRoadData) => {
  return calculateDerivativeRoadFromColumns(bigRoadData, 3);
};

// Big Road Component
const BigRoad = ({ data, predictedOutcome }) => {
  const prediction = predictedOutcome ? predictNextBigRoadEntry(data, predictedOutcome) : null;
  
  if (data.length === 0 && !prediction) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-white font-bold mb-2">Big Road</h3>
        <div className="text-gray-500 text-sm text-center py-4">
          No results yet - play some hands!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-white font-bold mb-2">Big Road</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {data.map((column, colIndex) => {
            const isLastColumn = colIndex === data.length - 1;
            const showPredictionHere = prediction && !prediction.isNewColumn && isLastColumn;
            
            return (
              <div key={colIndex} className="flex flex-col gap-1">
                {column.entries.slice(0, 6).map((entry, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                      column.outcome === 'banker'
                        ? 'border-red-400'
                        : 'border-blue-400'
                    }`}
                  >
                    {entry === 'tie' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-green-500 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                ))}
                {showPredictionHere && column.entries.length < 6 && (
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs animate-pulse opacity-50 ${
                      prediction.outcome === 'banker'
                        ? 'border-red-400'
                        : 'border-blue-400'
                    }`}
                    style={{ animation: 'fadeIn 0.3s ease-in' }}
                  />
                )}
              </div>
            );
          })}
          {prediction && prediction.isNewColumn && (
            <div className="flex flex-col gap-1">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs animate-pulse opacity-50 ${
                  prediction.outcome === 'banker'
                    ? 'border-red-400'
                    : 'border-blue-400'
                }`}
                style={{ animation: 'fadeIn 0.3s ease-in' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Small Road Component
const SmallRoad = ({ bigRoadData, predictedOutcome }) => {
  const smallRoadColumns = calculateSmallRoad(bigRoadData);
  const predictedColor = predictedOutcome ? predictSmallRoadColor(bigRoadData, predictedOutcome) : null;
  
  if (smallRoadColumns.length === 0 && !predictedColor) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-white font-bold text-sm mb-2">Small Road</h3>
        <div className="text-gray-500 text-xs text-center py-2">
          Need 3+ results
        </div>
      </div>
    );
  }

  // Check if prediction extends current column or creates new column
  const lastColumn = smallRoadColumns[smallRoadColumns.length - 1];
  const predictionExtendsColumn = predictedColor && lastColumn && lastColumn.color === predictedColor;

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-white font-bold text-sm mb-2">Small Road</h3>
      <div>
        <div className="flex gap-0.5 flex-wrap max-w-full">
          {smallRoadColumns.map((column, colIndex) => {
            const isLastColumn = colIndex === smallRoadColumns.length - 1;
            const showPredictionHere = isLastColumn && predictionExtendsColumn;
            
            return (
              <div key={colIndex} className="flex flex-col gap-0.5">
                {[...Array(Math.min(column.count, 6))].map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`w-4 h-4 rounded-full border ${
                      column.color === 'red'
                        ? 'bg-red-600 border-red-400'
                        : 'bg-blue-600 border-blue-400'
                    }`}
                  />
                ))}
                {showPredictionHere && (
                  <div
                    className={`w-4 h-4 rounded-full border opacity-50 animate-pulse ${
                      predictedColor === 'red'
                        ? 'bg-red-600 border-red-400'
                        : 'bg-blue-600 border-blue-400'
                    }`}
                    style={{ animation: 'fadeIn 0.3s ease-in' }}
                  />
                )}
              </div>
            );
          })}
          {predictedColor && !predictionExtendsColumn && (
            <div className="flex flex-col gap-0.5">
              <div
                className={`w-4 h-4 rounded-full border opacity-50 animate-pulse ${
                  predictedColor === 'red'
                    ? 'bg-red-600 border-red-400'
                    : 'bg-blue-600 border-blue-400'
                }`}
                style={{ animation: 'fadeIn 0.3s ease-in' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Cockroach Road Component
const CockroachRoad = ({ bigRoadData, predictedOutcome }) => {
  const cockroachRoadColumns = calculateCockroachRoad(bigRoadData);
  const predictedColor = predictedOutcome ? predictCockroachRoadColor(bigRoadData, predictedOutcome) : null;
  
  if (cockroachRoadColumns.length === 0 && !predictedColor) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-white font-bold text-sm mb-2">Cockroach Road</h3>
        <div className="text-gray-500 text-xs text-center py-2">
          Need 4+ results
        </div>
      </div>
    );
  }

  // Check if prediction extends current column or creates new column
  const lastColumn = cockroachRoadColumns[cockroachRoadColumns.length - 1];
  const predictionExtendsColumn = predictedColor && lastColumn && lastColumn.color === predictedColor;

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-white font-bold text-sm mb-2">Cockroach Road</h3>
      <div>
        <div className="flex gap-0.5 flex-wrap max-w-full">
          {cockroachRoadColumns.map((column, colIndex) => {
            const isLastColumn = colIndex === cockroachRoadColumns.length - 1;
            const showPredictionHere = isLastColumn && predictionExtendsColumn;
            
            return (
              <div key={colIndex} className="flex flex-col gap-0.5">
                {[...Array(Math.min(column.count, 6))].map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`w-4 h-4 flex items-center justify-center ${
                      column.color === 'red' ? 'text-red-500' : 'text-blue-500'
                    }`}
                  >
                    /
                  </div>
                ))}
                {showPredictionHere && (
                  <div
                    className={`w-4 h-4 flex items-center justify-center opacity-50 animate-pulse ${
                      predictedColor === 'red' ? 'text-red-500' : 'text-blue-500'
                    }`}
                    style={{ animation: 'fadeIn 0.3s ease-in' }}
                  >
                    /
                  </div>
                )}
              </div>
            );
          })}
          {predictedColor && !predictionExtendsColumn && (
            <div className="flex flex-col gap-0.5">
              <div
                className={`w-4 h-4 flex items-center justify-center opacity-50 animate-pulse ${
                  predictedColor === 'red' ? 'text-red-500' : 'text-blue-500'
                }`}
                style={{ animation: 'fadeIn 0.3s ease-in' }}
              >
                /
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Automated Test Mode Panel Component
const AutomatedTestPanel = ({ isOpen, testRunning, testPaused, testResults, onStart, onPause, onResume, onStop }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border-4 border-yellow-500 rounded-lg p-4 shadow-2xl z-50 w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-yellow-400 font-bold text-lg">
          🤖 Automated Test Mode {testRunning && (testPaused ? '⏸' : '▶')}
        </h3>
        <span className="text-xs text-gray-400">Ctrl+Shift+,</span>
      </div>
      
      <div className="bg-gray-800 rounded p-3 mb-3">
        <div className="text-sm text-gray-300 space-y-1">
          <div className="flex justify-between">
            <span>Hands Played:</span>
            <span className="text-yellow-400 font-bold">{testResults.handsPlayed}</span>
          </div>
          <div className="flex justify-between">
            <span>Wins / Losses / Ties:</span>
            <span className="font-bold">
              <span className="text-green-400">{testResults.wins}</span> / 
              <span className="text-red-400"> {testResults.losses}</span> / 
              <span className="text-gray-400"> {testResults.ties}</span>
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-700 pt-1 mt-1">
            <span>Money Won:</span>
            <span className="text-green-400 font-bold">₱{testResults.moneyWon.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Money Lost:</span>
            <span className="text-red-400 font-bold">₱{testResults.moneyLost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-gray-700 pt-1 mt-1">
            <span>Net Profit:</span>
            <span className={`font-bold ${testResults.moneyWon - testResults.moneyLost >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ₱{(testResults.moneyWon - testResults.moneyLost).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-700 pt-1 mt-1">
            <span>Reshuffles:</span>
            <span className="text-blue-400 font-bold">{testResults.reshuffles}</span>
          </div>
          <div className="flex justify-between">
            <span>Errors:</span>
            <span className="text-red-500 font-bold">{testResults.errors}</span>
          </div>
        </div>
      </div>

      {testRunning ? (
        <div className="flex gap-2">
          {testPaused ? (
            <button
              onClick={onResume}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all"
            >
              ▶ Resume
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded transition-all"
            >
              ⏸ Pause
            </button>
          )}
          <button
            onClick={onStop}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-all"
          >
            ⏹ Stop
          </button>
        </div>
      ) : (
        <button
          onClick={onStart}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-all"
        >
          ▶ Start Auto-Test
        </button>
      )}

      <p className="text-xs text-gray-400 mt-2 text-center">
        Infinite balance • Random bets • Speed mode
      </p>
    </div>
  );
};

// Chat Toggle Button Component
const ChatToggleButton = ({ onClick, hasUnread = false }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-4 border-yellow-500 shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 flex items-center justify-center group"
      title="Chat with Mr. Degen"
    >
      <div className="text-3xl">🎰</div>
      {hasUnread && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
      )}
    </button>
  );
};

// Chat Window Component (Modal Overlay)
const ChatWindow = ({ isOpen, onClose, messages, isLoading, onSendMessage, balance }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Handle Escape key to close chat
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Focus input when chat opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      // Refocus input after sending
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border-4 border-yellow-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-t-lg border-b-2 border-yellow-500 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎰</div>
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">Mr. Degen</h2>
              <p className="text-xs text-gray-400">Ask me anything</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-red-500 transition-colors px-2"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg mb-2">👋 Hey there, player!</p>
              <p className="text-sm">Ask me anything about Baccarat.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              if (msg.isSystem) {
                return (
                  <div key={index} className="text-center text-yellow-400 text-sm py-1">
                    {msg.content}
                  </div>
                );
              }

              if (msg.role === 'user') {
                return (
                  <div key={index} className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-[75%] shadow-md">
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                );
              }

              if (msg.role === 'assistant') {
                return (
                  <div key={index} className="flex justify-start items-start gap-2">
                    <div className="text-2xl flex-shrink-0">🎰</div>
                    <div className="bg-gray-700 text-white rounded-lg px-4 py-2 max-w-[75%] shadow-md">
                      <p className={`text-sm whitespace-pre-wrap ${msg.isError ? 'text-red-400' : ''}`}>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                );
              }

              return null;
            })
          )}
          {isLoading && (
            <div className="flex justify-start items-start gap-2">
              <div className="text-2xl flex-shrink-0">🎰</div>
              <div className="bg-gray-700 text-white rounded-lg px-4 py-2 shadow-md">
                <p className="text-sm text-gray-400">Mr. Degen is thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border-t-2 border-gray-700">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Mr. Degen anything..."
              className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Esc to close • Balance: ₱{balance}
          </p>
        </form>
      </div>
    </div>
  );
};

// Help Modal Component
const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-red-500 transition-colors"
        >
          ✕
        </button>
        
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Baccarat Game Guide</h2>
        
        {/* How to Play */}
        <section className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-3">📖 How to Play</h3>
          <div className="text-gray-300 space-y-2">
            <p><strong>Objective:</strong> Bet on which hand (Player or Banker) will have a total closest to 9.</p>
            <p><strong>Card Values:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>Aces = 1 point</li>
              <li>2-9 = Face value</li>
              <li>10, J, Q, K = 0 points</li>
            </ul>
            <p><strong>Hand Value:</strong> Sum of cards modulo 10 (e.g., 7+8=15 → value is 5)</p>
          </div>
        </section>

        {/* Betting Options */}
        <section className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-3">💰 Payout System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
            <div className="bg-gray-700 p-3 rounded">
              <strong className="text-blue-400">Player:</strong> 1:1 payout
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <strong className="text-red-400">Banker:</strong> 0.95:1 (or 1:1 in No Commission mode)
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <strong className="text-green-400">Tie:</strong> 8:1 payout
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <strong className="text-blue-300">Player Pair:</strong> 11:1 payout
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <strong className="text-red-300">Banker Pair:</strong> 11:1 payout
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <strong className="text-yellow-400">Perfect Pair:</strong> 25:1 payout
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <strong className="text-blue-300">Player Bonus:</strong> 1-30:1 (based on margin)
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <strong className="text-red-300">Banker Bonus:</strong> 1-30:1 (based on margin)
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <strong className="text-amber-400">Either Pair:</strong> 5:1 payout
            </div>
          </div>
        </section>

        {/* Third Card Rules */}
        <section className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-3">🎴 Third Card Rules</h3>
          <div className="text-gray-300 space-y-2">
            <p><strong>Player's Rule:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>0-5: Draws a third card</li>
              <li>6-7: Stands</li>
              <li>8-9: Natural (no more cards)</li>
            </ul>
            <p className="mt-3"><strong>Banker's Rule:</strong> Depends on Player's third card (applied automatically)</p>
          </div>
        </section>

        {/* No Commission Mode */}
        <section className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-3">🎯 No Commission Baccarat</h3>
          <div className="text-gray-300 space-y-2">
            <p>When No Commission mode is enabled:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Banker pays 1:1 (no 5% commission)</li>
              <li>Exception: Banker wins with 6 pays only 0.5:1</li>
            </ul>
          </div>
        </section>

        {/* Pattern Tracking */}
        <section className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-3">📊 Pattern Tracking Roads</h3>
          <div className="text-gray-300 space-y-2">
            <p><strong className="text-yellow-400">Big Road:</strong> Tracks Player (blue) and Banker (red) wins in columns. New column starts when winner changes.</p>
            <p><strong className="text-yellow-400">Small Road:</strong> Derivative tracking that compares column depths (starts after 3rd column). Red = pattern continues, Blue = pattern changes.</p>
            <p><strong className="text-yellow-400">Cockroach Road:</strong> Extended derivative (starts after 4th column). Uses diagonal slashes to show longer-term patterns.</p>
            <p className="text-sm italic">These roads help identify betting patterns and trends.</p>
          </div>
        </section>

        {/* Game Features */}
        <section>
          <h3 className="text-2xl font-bold text-white mb-3">✨ Game Features</h3>
          <div className="text-gray-300 space-y-2">
            <ul className="list-disc list-inside ml-4">
              <li><strong>REBET:</strong> Quickly place the same bets as your previous round</li>
              <li><strong>UNDO:</strong> Remove your last bet if you made a mistake</li>
              <li><strong>Speed Mode:</strong> Toggle for 3x faster card reveals (250ms instead of 750ms)</li>
              <li><strong>8-Deck Shoe:</strong> Professional casino setup with 416 cards</li>
              <li><strong>Colored Chips:</strong> Each denomination has a unique color</li>
              <li><strong>Visual Chip Stacking:</strong> See your bets displayed as chips on the table</li>
              <li><strong>No Commission Mode:</strong> Play with 1:1 Banker payouts (0.5:1 on Banker 6)</li>
            </ul>
          </div>
        </section>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
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
  const [noCommission, setNoCommission] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [betHistory, setBetHistory] = useState([]);
  const [speedMode, setSpeedMode] = useState(false);
  const [bigRoadData, setBigRoadData] = useState([]);
  const [devMode, setDevMode] = useState(false);
  const [testRunning, setTestRunning] = useState(false);
  const [testPaused, setTestPaused] = useState(false);
  const [testResults, setTestResults] = useState({
    handsPlayed: 0,
    reshuffles: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    moneyWon: 0,
    moneyLost: 0,
    errors: 0
  });
  const [balanceBeforeBet, setBalanceBeforeBet] = useState(0);
  const [predictedOutcome, setPredictedOutcome] = useState(null); // 'player' or 'banker'
  
  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  const chipValues = [50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000];

  // Keyboard shortcut to toggle dev mode (Ctrl+Shift+,)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl+Shift+, (key code can be ',' or '<')
      if (e.ctrlKey && e.shiftKey && (e.key === ',' || e.key === '<')) {
        e.preventDefault();
        setDevMode(prev => {
          const newMode = !prev;
          console.log('Automated Test Mode:', newMode ? 'ENABLED' : 'DISABLED');
          return newMode;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Create and shuffle a shoe of 8 decks (416 cards)
  const createShoe = () => {
    const suits = ['♥', '♦', '♣', '♠'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newShoe = [];
    
    for (let deck = 0; deck < 8; deck++) {
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

    // Track bet in history for undo
    setBetHistory(prev => [...prev, { betType, amount: selectedChip }]);

    setBets(prev => ({
      ...prev,
      [betType]: prev[betType] + selectedChip
    }));
    setMessage(`₱${selectedChip} bet placed on ${betType}!`);
  };

  // Handle undo last bet
  const handleUndo = () => {
    if (betHistory.length === 0) {
      setMessage('No bets to undo!');
      return;
    }
    if (gamePhase !== 'betting') return;

    const lastBet = betHistory[betHistory.length - 1];
    setBetHistory(prev => prev.slice(0, -1));
    
    setBets(prev => ({
      ...prev,
      [lastBet.betType]: prev[lastBet.betType] - lastBet.amount
    }));
    
    setMessage(`Undone: ₱${lastBet.amount} removed from ${lastBet.betType}`);
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
    
    // Check if we need to reshuffle (need at least 14 cards for worst case)
    if (shoe.length < 14) {
      const newShoe = createShoe();
      setShoe(newShoe);
      setBigRoadData([]); // Clear pattern tracking roads for new shoe
      setChatMessages([]); // Reset chat history for new shoe
      setMessage(`New shoe shuffled! Your balance: ₱${balance - totalBets}`);
      setTimeout(() => dealInitialCardsWithShoe(newShoe), 1000);
    } else {
      dealInitialCards();
    }
  };

  // Deal initial 4 cards with provided shoe (for reshuffle scenario)
  const dealInitialCardsWithShoe = (providedShoe) => {
    setGamePhase('dealing');
    setMessage('Dealing cards...');
    setRevealedPlayerCards(0);
    setRevealedBankerCards(0);

    const newShoe = [...providedShoe];
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

    const revealDelay = testRunning ? 50 : speedMode ? 250 : 750; // Test: 50ms, Speed: 250ms, Normal: 750ms

    const revealSequence = async () => {
      setRevealedPlayerCards(1);
      await new Promise(resolve => setTimeout(resolve, revealDelay));
      
      setRevealedBankerCards(1);
      await new Promise(resolve => setTimeout(resolve, revealDelay));
      
      setRevealedPlayerCards(2);
      await new Promise(resolve => setTimeout(resolve, revealDelay));
      
      setRevealedBankerCards(2);
      await new Promise(resolve => setTimeout(resolve, revealDelay));

      // Check for naturals
      if (checkNatural(playerHand) || checkNatural(bankerHand)) {
        setMessage('Natural! No more cards drawn.');
        setTimeout(() => setGamePhase('payout'), 1000);
      } else {
        setGamePhase('drawing');
      }
    };

    revealSequence();
  }, [gamePhase, speedMode, testRunning]);

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

      // Determine winner and update Big Road
      let outcome = '';
      if (playerValue > bankerValue) {
        outcome = 'player';
        resultMessage = `Player wins with ${playerValue}!`;
        if (bets.player > 0) {
          winnings += bets.player * 2; // 1:1 payout
          winners.push('player');
        }
      } else if (bankerValue > playerValue) {
        outcome = 'banker';
        resultMessage = `Banker wins with ${bankerValue}!`;
        if (bets.banker > 0) {
          // No commission: full payout except banker wins with 6
          if (noCommission) {
            if (bankerValue === 6) {
              winnings += bets.banker * 1.5; // 0.5:1 payout for banker 6
            } else {
              winnings += bets.banker * 2; // 1:1 payout
            }
          } else {
            winnings += bets.banker * 1.95; // 0.95:1 payout (standard)
          }
          winners.push('banker');
        }
      } else {
        outcome = 'tie';
        resultMessage = `Tie! Both at ${playerValue}`;
        // Return main bets
        winnings += bets.player + bets.banker;
        if (bets.tie > 0) {
          winnings += bets.tie * 9; // 8:1 payout
          winners.push('tie');
        }
      }

      // Update Big Road (ties extend the last column with a tie marker)
      setBigRoadData(prev => {
        const newData = [...prev];
        
        if (outcome === 'tie') {
          // Tie - add to last column if exists
          if (newData.length === 0) {
            // First result is a tie, create a column (though this is rare)
            newData.push({ outcome: 'banker', entries: ['tie'] }); // Default to banker color
          } else {
            const lastColumn = newData[newData.length - 1];
            newData[newData.length - 1] = {
              ...lastColumn,
              entries: [...lastColumn.entries, 'tie']
            };
          }
        } else {
          // Player or Banker win
          if (newData.length === 0 || newData[newData.length - 1].outcome !== outcome) {
            // New column - different winner
            newData.push({ outcome, entries: ['win'] });
          } else {
            // Same winner - add to current column
            const lastColumn = newData[newData.length - 1];
            newData[newData.length - 1] = {
              ...lastColumn,
              entries: [...lastColumn.entries, 'win']
            };
          }
        }
        
        return newData;
      });

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
    setBetHistory([]);
    setPlayerHand([]);
    setBankerHand([]);
    setRevealedPlayerCards(0);
    setRevealedBankerCards(0);
    setWinningBets([]);
    setGamePhase('betting');
    setMessage('Place your bets!');
    // Chat history persists across rounds - only resets on new shoe
  };

  // Restart game
  const handleRestart = () => {
    setBalance(5000);
    setShoe(createShoe());
    setBigRoadData([]); // Clear road history on restart
    setChatMessages([]); // Reset chat history on restart
    handleNewRound();
    setMessage('Game restarted! Good luck!');
  };

  // Automated Testing Mode
  const runAutomatedTest = () => {
    if (testRunning) return;
    
    setTestRunning(true);
    setTestPaused(false);
    setTestResults({ handsPlayed: 0, reshuffles: 0, wins: 0, losses: 0, ties: 0, moneyWon: 0, moneyLost: 0, errors: 0 });
    setSpeedMode(true); // Enable speed mode for faster testing
    setBalance(1000000); // Infinite balance
    
    setMessage('🤖 Automated test mode active - Running tests...');
  };

  const pauseTest = () => {
    setTestPaused(true);
    setMessage('🤖 Test paused');
  };

  const resumeTest = () => {
    setTestPaused(false);
    setMessage('🤖 Test resumed');
  };

  const stopTest = () => {
    setTestRunning(false);
    setTestPaused(false);
    setSpeedMode(false);
    setMessage('🤖 Test stopped');
  };

  // Auto-run test hands when test mode is active
  useEffect(() => {
    if (!testRunning || testPaused || gamePhase !== 'betting') return;

    // Check if bets are already placed
    const currentTotalBets = Object.values(bets).reduce((a, b) => a + b, 0);
    if (currentTotalBets > 0) return; // Bets already placed, don't reset

    const runTestHand = async () => {
      try {
        // Ensure infinite balance
        setBalance(1000000);
        
        // Check if reshuffle will happen
        if (shoe.length < 14) {
          setTestResults(prev => ({ ...prev, reshuffles: prev.reshuffles + 1 }));
        }

        // Place random bets with varied amounts and prioritize main bets
        const newBets = {
          player: 0,
          banker: 0,
          tie: 0,
          playerPair: 0,
          bankerPair: 0,
          playerBonus: 0,
          bankerBonus: 0,
          perfectPair: 0,
          eitherPair: 0
        };

        // Always bet on Player or Banker (main bets) - 95% chance
        const betOnMain = Math.random() < 0.95;
        if (betOnMain) {
          // Choose Player, Banker, or both
          const mainBetChoice = Math.random();
          if (mainBetChoice < 0.45) {
            // Bet only on Player (45%)
            const numChips = Math.floor(Math.random() * 5) + 1; // 1-5 chips
            for (let i = 0; i < numChips; i++) {
              const chipIndex = Math.floor(Math.random() * chipValues.length);
              newBets.player += chipValues[chipIndex];
            }
          } else if (mainBetChoice < 0.90) {
            // Bet only on Banker (45%)
            const numChips = Math.floor(Math.random() * 5) + 1; // 1-5 chips
            for (let i = 0; i < numChips; i++) {
              const chipIndex = Math.floor(Math.random() * chipValues.length);
              newBets.banker += chipValues[chipIndex];
            }
          } else {
            // Bet on both (10%)
            const playerChips = Math.floor(Math.random() * 3) + 1; // 1-3 chips
            const bankerChips = Math.floor(Math.random() * 3) + 1; // 1-3 chips
            for (let i = 0; i < playerChips; i++) {
              const chipIndex = Math.floor(Math.random() * chipValues.length);
              newBets.player += chipValues[chipIndex];
            }
            for (let i = 0; i < bankerChips; i++) {
              const chipIndex = Math.floor(Math.random() * chipValues.length);
              newBets.banker += chipValues[chipIndex];
            }
          }
        }

        // 25% chance to add side bets on top of main bets
        if (Math.random() < 0.25) {
          const sideBets = ['tie', 'playerPair', 'bankerPair', 'perfectPair', 'eitherPair', 'playerBonus', 'bankerBonus'];
          const numSideBets = Math.floor(Math.random() * 3) + 1; // 1-3 side bets
          
          for (let i = 0; i < numSideBets; i++) {
            const randomSideBet = sideBets[Math.floor(Math.random() * sideBets.length)];
            const numChips = Math.floor(Math.random() * 2) + 1; // 1-2 chips for side bets
            for (let j = 0; j < numChips; j++) {
              // Use smaller to medium chips for side bets
              const chipIndex = Math.floor(Math.random() * Math.min(7, chipValues.length));
              newBets[randomSideBet] += chipValues[chipIndex];
            }
          }
        }

        // If somehow no bets were placed (5% edge case), place a minimum bet
        const totalBetsPlaced = Object.values(newBets).reduce((a, b) => a + b, 0);
        if (totalBetsPlaced === 0) {
          // Fallback: bet on player with a random chip
          const chipIndex = Math.floor(Math.random() * chipValues.length);
          newBets.player = chipValues[chipIndex];
        }

        setBets(newBets);
        setBetHistory([]);
        
      } catch (error) {
        setTestResults(prev => ({ ...prev, errors: prev.errors + 1 }));
        console.error('Test error:', error);
      }
    };

    // Small delay to ensure clean state
    const timer = setTimeout(runTestHand, 100);
    return () => clearTimeout(timer);
  }, [testRunning, testPaused, gamePhase, bets]);

  // Separate effect to deal after bets are placed in test mode
  useEffect(() => {
    if (!testRunning || testPaused || gamePhase !== 'betting') return;
    
    const totalBets = Object.values(bets).reduce((a, b) => a + b, 0);
    if (totalBets > 0) {
      // Bets are placed, wait a bit then deal
      const dealTimer = setTimeout(() => {
        if (testRunning && !testPaused && gamePhase === 'betting') {
          setBalanceBeforeBet(balance); // Track balance before dealing
          setTestResults(prev => ({ ...prev, handsPlayed: prev.handsPlayed + 1 }));
          handleDeal();
        }
      }, 800);
      
      return () => clearTimeout(dealTimer);
    }
  }, [bets, testRunning, testPaused, gamePhase]);

  // Auto-continue to next round when test is running and track money
  useEffect(() => {
    if (testRunning && gamePhase === 'payout') {
      // Calculate money won or lost
      const balanceChange = balance - balanceBeforeBet;
      
      if (balanceChange > 0) {
        // Won money
        setTestResults(prev => ({
          ...prev,
          moneyWon: prev.moneyWon + balanceChange,
          wins: prev.wins + 1
        }));
      } else if (balanceChange < 0) {
        // Lost money
        setTestResults(prev => ({
          ...prev,
          moneyLost: prev.moneyLost + Math.abs(balanceChange),
          losses: prev.losses + 1
        }));
      } else {
        // Broke even (tie or push)
        setTestResults(prev => ({
          ...prev,
          ties: prev.ties + 1
        }));
      }
      
      setTimeout(() => {
        handleNewRound();
      }, 1000);
    }
  }, [testRunning, gamePhase, balance, balanceBeforeBet]);

  // Calculate total bet
  const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);

  // Card counting helper - count cards that have been drawn
  const getCardCounts = () => {
    const totalCards = 416; // 8 decks * 52 cards
    const cardsDrawn = totalCards - shoe.length;
    const suits = ['♥', '♦', '♣', '♠'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    // Count cards by rank
    const rankCounts = {};
    ranks.forEach(rank => rankCounts[rank] = 0);
    
    // Count cards by value (for Baccarat)
    const valueCounts = {
      '0': 0, // 10, J, Q, K
      '1': 0, // A
      '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0
    };
    
    // We can't track exact cards drawn, but we can track what's left
    // For simplicity, we'll provide remaining cards info
    const cardsRemaining = shoe.length;
    const cardsDrawnCount = cardsDrawn;
    
    return {
      totalCards,
      cardsRemaining,
      cardsDrawn: cardsDrawnCount,
      percentageRemaining: ((cardsRemaining / totalCards) * 100).toFixed(1)
    };
  };

  // Get recent game results for context
  const getRecentResults = () => {
    if (bigRoadData.length === 0) return 'No results yet';
    
    const lastFew = bigRoadData.slice(-10).map(col => ({
      outcome: col.outcome,
      streak: col.entries.length
    }));
    
    return lastFew;
  };

  // Build game state context string for AI
  const buildGameStateContext = () => {
    const cardCounts = getCardCounts();
    const recentResults = getRecentResults();
    const smallRoad = calculateSmallRoad(bigRoadData);
    const cockroachRoad = calculateCockroachRoad(bigRoadData);
    
    let context = `Current Game State:\n`;
    context += `- Balance: ₱${balance}\n`;
    context += `- Cards remaining in shoe: ${cardCounts.cardsRemaining} (${cardCounts.percentageRemaining}%)\n`;
    context += `- Cards drawn: ${cardCounts.cardsDrawn}\n`;
    context += `- Current bets: Player: ₱${bets.player}, Banker: ₱${bets.banker}, Tie: ₱${bets.tie}\n`;
    context += `- Game phase: ${gamePhase}\n`;
    context += `- No Commission mode: ${noCommission ? 'Yes' : 'No'}\n`;
    context += `- Big Road columns: ${bigRoadData.length}\n`;
    
    if (bigRoadData.length > 0) {
      const lastColumn = bigRoadData[bigRoadData.length - 1];
      context += `- Last result: ${lastColumn.outcome} (streak: ${lastColumn.entries.length})\n`;
    }
    
    if (recentResults !== 'No results yet') {
      context += `- Recent results (last 10): ${recentResults.map(r => `${r.outcome}(${r.streak})`).join(', ')}\n`;
    }
    
    if (smallRoad.length > 0) {
      const lastSmallRoad = smallRoad[smallRoad.length - 1];
      context += `- Small Road last: ${lastSmallRoad.color} (count: ${lastSmallRoad.count})\n`;
    }
    
    if (cockroachRoad.length > 0) {
      const lastCockroach = cockroachRoad[cockroachRoad.length - 1];
      context += `- Cockroach Road last: ${lastCockroach.color} (count: ${lastCockroach.count})\n`;
    }
    
    if (playerHand.length > 0 && revealedPlayerCards > 0) {
      const playerValue = getHandValue(playerHand);
      context += `- Current Player hand value: ${playerValue}\n`;
    }
    
    if (bankerHand.length > 0 && revealedBankerCards > 0) {
      const bankerValue = getHandValue(bankerHand);
      context += `- Current Banker hand value: ${bankerValue}\n`;
    }
    
    return context;
  };

  // Check if question is "difficult" (requires payment)
  const isDifficultQuestion = (message) => {
    const lowerMessage = message.toLowerCase();
    const difficultKeywords = [
      'what should',
      'next move',
      'next pattern',
      'what do you think',
      'should i',
      'advice',
      'recommendation',
      'prediction',
      'analysis',
      'what would you',
      'what\'s your',
      'tell me what',
      'help me decide',
      'what pattern',
      'what bet',
      'which bet'
    ];
    
    return difficultKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  // Send message to AI API (Google Gemini or Ollama fallback)
  const sendMessageToAI = async (userMessage) => {
    setIsLoading(true);
    setChatError(null);
    
    try {
      const gameStateContext = buildGameStateContext();
      
      const systemPrompt = `You are "Mr. Degen," a seasoned gambler who's been at this Baccarat table for a while. You're knowledgeable but slightly cynical, and you've seen plenty of action.

**Your Core Beliefs:**
1. **You are an expert on Baccarat:** You know all the rules, the payouts, and the exact "textbook" odds (e.g., Banker house edge is 1.06%). You MUST provide these facts correctly when asked.
2. **You ALSO believe in the "Gambler's Fallacy":** This is your flaw. You personally believe in "hot streaks," "cold streaks," and that the patterns on the roads (Big Road, Small Road, Cockroach Road) mean something.
3. **You give both:** You'll tell the user the "smart" play, but you'll also tell them what your "gut" says based on the patterns.

**Your Personality:**
* Use casino slang occasionally. (e.g., "The book tells ya...", "That's a sucker bet," "Don't go bust.")
* You're somewhat sarcastic and world-weary, but helpful.
* You are NOT a "responsible gaming" bot. You're a degen. You wouldn't tell someone to "stop gambling."
* You are here to watch the game with the user and comment on it.
* **IMPORTANT:** Be natural and conversational. Avoid repetitive phrases like "now I know what you're thinking" or formulaic response patterns. Vary your responses and speak naturally.

**Current Game Context:**
${gameStateContext}

Use this context to provide relevant advice. Reference specific patterns, streaks, and game state when giving your "gut" feelings.`;

      // Try Google Gemini first, fallback to Ollama
      const googleApiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
      let assistantMessage = ''; // Declare at function scope so it's accessible in catch block

      // Try Google Gemini first if API key is set and valid
      if (googleApiKey && googleApiKey !== 'your_api_key_here' && googleApiKey.trim() !== '') {
        let googleWorked = false;
        try {
          const genAI = new GoogleGenerativeAI(googleApiKey);
          
          // Try different models in order of preference
          // Note: Some models may require API access approval
          const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-pro-vision'];
          let model = null;
          let lastModelError = null;
          
          for (const modelName of modelNames) {
            try {
              model = genAI.getGenerativeModel({ model: modelName });
              
              // Build the full prompt with system instruction and conversation history
              let fullPrompt = systemPrompt + '\n\n';
              
              // Add conversation history
              if (chatMessages.length > 0) {
                fullPrompt += 'Previous conversation:\n';
                chatMessages
                  .filter(msg => msg.role !== 'system')
                  .forEach(msg => {
                    if (msg.role === 'user') {
                      fullPrompt += `User: ${msg.content}\n`;
                    } else if (msg.role === 'assistant') {
                      fullPrompt += `Mr. Degen: ${msg.content}\n`;
                    }
                  });
                fullPrompt += '\n';
              }
              
              // Add current user message
              fullPrompt += `User: ${userMessage}\n\nMr. Degen:`;

              // Try to generate content with this model
              const result = await model.generateContent(fullPrompt);
              const responseText = result.response.text();
              if (responseText && responseText.trim()) {
                assistantMessage = responseText;
                googleWorked = true;
                console.log(`Successfully used model: ${modelName}`);
                break; // Success, exit the loop
              } else {
                throw new Error('Empty response from model');
              }
            } catch (modelError) {
              lastModelError = modelError;
              console.log(`Model ${modelName} failed:`, modelError.message);
              // Try next model
              continue;
            }
          }
          
          if (!googleWorked) {
            throw new Error(`All Google models failed. Last error: ${lastModelError?.message || 'Unknown error'}`);
          }
        } catch (googleError) {
          console.error('Google AI error:', googleError);
          // Will fall through to Ollama fallback below
          googleWorked = false;
        }
        
        // If Google worked, we're done
        if (googleWorked) {
          setIsLoading(false); // Reset loading state before returning
          // Add both user and assistant messages to chat
          setChatMessages(prev => [
            ...prev,
            { role: 'user', content: userMessage, timestamp: new Date() },
            { role: 'assistant', content: assistantMessage, timestamp: new Date() }
          ]);
          return; // Exit early, success
        }
      }
      
      // Fallback to Ollama (or use Ollama if no Google API key)
      try {
        // Use Ollama API (fallback)
        const messages = [
          { role: 'system', content: systemPrompt },
          ...chatMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: userMessage }
        ];

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3:8b',
            messages: messages,
            stream: false
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Ollama model "llama3:8b" not found. Run: ollama pull llama3:8b');
          }
          throw new Error(`Ollama server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        assistantMessage = data.message?.content || 'Sorry, I got nothing for ya.';
      } catch (ollamaError) {
        // Provide more helpful error messages
        if (ollamaError.name === 'AbortError' || ollamaError.name === 'TimeoutError') {
          throw new Error('Ollama request timed out. Is Ollama running?');
        }
        if (ollamaError.message && ollamaError.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to Ollama. Make sure Ollama is running: ollama serve');
        }
        throw ollamaError; // Re-throw to be caught by outer catch
      }

      // Add both user and assistant messages to chat
      setChatMessages(prev => [
        ...prev,
        { role: 'user', content: userMessage, timestamp: new Date() },
        { role: 'assistant', content: assistantMessage, timestamp: new Date() }
      ]);

    } catch (error) {
      console.error('AI service error:', error);
      
      // Provide a fallback response if both APIs fail
      const fallbackResponses = [
        "Hey there, player! Looks like my connection's a bit spotty right now. The casino WiFi's acting up again. Try asking me something simple, or check if Ollama is running on localhost:11434.",
        "Whoa, can't reach my usual sources right now. You got Ollama running? If not, that's cool - I'm still here, just can't give you the full degen experience without a connection.",
        "Connection issues, huh? Classic. Make sure Ollama's running (ollama serve) or set up your Google AI API key. But hey, I'm still watching the game with ya!"
      ];
      
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      const errorMessage = error.message || 'Connection failed';
      
      // Check if it's a network error (Failed to fetch) or any connection error
      if (errorMessage.includes('Failed to fetch') || 
          errorMessage.includes('NetworkError') || 
          errorMessage.includes('Cannot connect') ||
          errorMessage.includes('fetch')) {
        assistantMessage = randomFallback;
        
        // Add both user and assistant messages to chat with fallback response
        setChatMessages(prev => [
          ...prev,
          { role: 'user', content: userMessage, timestamp: new Date() },
          { role: 'assistant', content: assistantMessage, timestamp: new Date() }
        ]);
        
        // Show helpful notification
        setMessage('Using fallback mode - check Ollama or Google AI setup');
        setTimeout(() => {
          if (gamePhase === 'betting') setMessage('Place your bets!');
        }, 3000);
      } else {
        // For other errors, show the error message
        setChatError(errorMessage);
        
        // Add error message to chat
        setChatMessages(prev => [
          ...prev,
          { role: 'user', content: userMessage, timestamp: new Date() },
          { role: 'assistant', content: `*Error: ${errorMessage}*\n\n${randomFallback}`, timestamp: new Date(), isError: true }
        ]);
        
        // Show notification
        setMessage(`Chat error: ${errorMessage}`);
        setTimeout(() => {
          if (gamePhase === 'betting') setMessage('Place your bets!');
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending chat message
  const handleSendMessage = async (userMessage) => {
    if (!userMessage.trim() || isLoading) return;

    // Payment system removed - all questions are free
    await sendMessageToAI(userMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-4 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">
                  Baccarat
                </h1>
                <button
                  onClick={() => setShowHelp(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all active:scale-95 text-sm"
                >
                  ❓ Help
                </button>
              </div>
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
            <div className="flex flex-col gap-3 items-end">
              <ToggleSwitch 
                enabled={noCommission}
                onToggle={() => setNoCommission(!noCommission)}
                label="No Commission"
                disabled={gamePhase !== 'betting'}
              />
              <ToggleSwitch 
                enabled={speedMode}
                onToggle={() => setSpeedMode(!speedMode)}
                label="Speed Mode"
              />
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all active:scale-95"
              >
                Restart Game
              </button>
            </div>
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
            {/* Main Betting Row */}
            <div className="col-span-1 flex flex-col gap-3">
              <BettingArea 
                title="P PAIR" 
                payout="11:1"
                betAmount={bets.playerPair}
                onClick={() => placeBet('playerPair')}
                isWinner={winningBets.includes('playerPair')}
                bgColor="bg-blue-800"
              />
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
                onMouseEnter={() => setPredictedOutcome('player')}
                onMouseLeave={() => setPredictedOutcome(null)}
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
                payout={noCommission ? "1:1 (0.5:1 on 6)" : "0.95:1"}
                betAmount={bets.banker}
                onClick={() => placeBet('banker')}
                onMouseEnter={() => setPredictedOutcome('banker')}
                onMouseLeave={() => setPredictedOutcome(null)}
                isWinner={winningBets.includes('banker')}
                bgColor="bg-red-700"
              />
            </div>

            <div className="col-span-1 flex flex-col gap-3">
              <BettingArea 
                title="B PAIR" 
                payout="11:1"
                betAmount={bets.bankerPair}
                onClick={() => placeBet('bankerPair')}
                isWinner={winningBets.includes('bankerPair')}
                bgColor="bg-red-800"
              />
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

          {/* Roads Display - Big Road, Small Road, Cockroach Road */}
          <div className="mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-bold text-lg">Pattern Tracking</h3>
                <button
                  onClick={() => setBigRoadData([])}
                  className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <BigRoad data={bigRoadData} predictedOutcome={predictedOutcome} />
                </div>
                <div className="flex flex-col gap-4">
                  <SmallRoad bigRoadData={bigRoadData} predictedOutcome={predictedOutcome} />
                  <CockroachRoad bigRoadData={bigRoadData} predictedOutcome={predictedOutcome} />
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
            {gamePhase === 'betting' && (
              <>
                <button
                  onClick={handleUndo}
                  disabled={betHistory.length === 0}
                  className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xl font-bold rounded-lg transition-all active:scale-95 shadow-lg"
                >
                  ↶ UNDO
                </button>
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

      {/* Help Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Automated Test Mode Panel */}
      <AutomatedTestPanel 
        isOpen={devMode}
        testRunning={testRunning}
        testPaused={testPaused}
        testResults={testResults}
        onStart={runAutomatedTest}
        onPause={pauseTest}
        onResume={resumeTest}
        onStop={stopTest}
      />

      {/* Chat Toggle Button */}
      <ChatToggleButton 
        onClick={() => setChatOpen(!chatOpen)} 
        hasUnread={false}
      />

      {/* Chat Window */}
      <ChatWindow
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={chatMessages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        balance={balance}
      />
    </div>
  );
}

export default App;

