import React, { useState } from 'react';
import './styles.css'; // Import the new styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const App = () => {
    const [balance, setBalance] = useState(0);
    const [startingAmount, setStartingAmount] = useState('');
    const [tradeAmount, setTradeAmount] = useState('');
    const [message, setMessage] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [tradeCount, setTradeCount] = useState(0);
    const [tradeHistory, setTradeHistory] = useState([]); // State to track trade history
    const [gameStarted, setGameStarted] = useState(false); // New state to track if the game has started

    // Function to handle starting the game
    const handleStart = () => {
        const amount = parseFloat(startingAmount);
        if (amount > 0) {
            setBalance(amount);
            setMessage(`Game started with $${amount}`);
            setStartingAmount('');
            setTradeCount(0); // Reset trade count
            setTradeHistory([]); // Reset trade history when the game starts
            setGameStarted(true); // Set game as started
        } else {
            setMessage('Please enter a valid starting amount.');
        }
    };

    // Function to handle each trade
    const handleTrade = () => {
        const tradeValue = parseFloat(tradeAmount);
        if (tradeValue > balance || tradeValue <= 0) {
            setMessage('Trade amount must be positive and cannot exceed current balance.');
            return;
        }

        const startBalance = balance;
        const win = Math.random() < 0.95;
        let outcome = '';
        let outcomeAmount = 0;
        let newBalance = balance;

        if (win) {
            const multiplier = Math.floor(Math.random() * 6) + 6;
            outcomeAmount = tradeValue * multiplier;
            newBalance += outcomeAmount;
            outcome = 'Win';
            setMessage(`You won $${outcomeAmount}! New balance: $${newBalance}`);
        } else {
            outcomeAmount = tradeValue;
            newBalance -= tradeValue;
            outcome = 'Lose';
            setMessage(`You lost $${tradeValue}. New balance: $${newBalance}`);
        }

        setBalance(newBalance);
        setTradeCount(tradeCount + 1);
        setTradeHistory([
            ...tradeHistory,
            {
                count: tradeCount + 1,
                startBalance,
                tradeAmount: tradeValue,
                outcome,
                outcomeAmount,
                newBalance,
            },
        ]);

        if (newBalance >= 1000000) {
            setMessage('Congratulations, you reached $1,000,000!');
            setGameOver(true);
        } else if (newBalance <= 0) {
            setMessage('Game Over, you lost all your money.');
            setGameOver(true);
        }

        setTradeAmount(''); // Reset trade amount after each trade
    };

    // Function to reset the game
    const resetGame = () => {
        setBalance(0);
        setTradeAmount('');
        setMessage('');
        setGameOver(false);
        setTradeCount(0);
        setTradeHistory([]);
        setGameStarted(false); // Reset game started state
    };

    return (
        <div>
            <h1>Trade Game</h1>
            {!gameStarted ? (
                <div>
                    <h2>Enter starting amount</h2>
                    <input
                        type="number"
                        value={startingAmount}
                        onChange={(e) => setStartingAmount(e.target.value)}
                    />
                    <button onClick={handleStart}>Start Game</button>
                    <p>{message}</p>
                </div>
            ) : (
                <div>
                    <h2>Current Balance: ${balance}</h2>
                    <h3>Number of Trades: {tradeCount}</h3>
                    <input
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        disabled={gameOver}
                    />
                    <button onClick={handleTrade} disabled={gameOver}>
                        Trade
                    </button>
                    <button onClick={resetGame}>Reset Game</button>
                    <p>{message}</p>

                    {/* Trade Summary Table */}
                    {tradeHistory.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Trade Count</th>
                                    <th>Starting Balance</th>
                                    <th>Trade Amount</th>
                                    <th>Win / Lose</th>
                                    <th>Win / Lose Amount</th>
                                    <th>New Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tradeHistory.map((trade) => (
                                    <tr key={trade.count}>
                                        <td>{trade.count}</td>
                                        <td>${trade.startBalance.toFixed(2)}</td>
                                        <td>${trade.tradeAmount.toFixed(2)}</td>
                                        <td className={`trade-status ${trade.outcome.toLowerCase()}`}>
                                            <FontAwesomeIcon
                                                icon={trade.outcome === 'Win' ? faArrowUp : faArrowDown}
                                                className="icon"
                                            />
                                            {trade.outcome}
                                        </td>
                                        <td>${trade.outcomeAmount.toFixed(2)}</td>
                                        <td>${trade.newBalance.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
