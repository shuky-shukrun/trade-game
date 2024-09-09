import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const App = () => {
    const [balance, setBalance] = useState(0);
    const [startingAmount, setStartingAmount] = useState('');
    const [tradeAmount, setTradeAmount] = useState('');
    const [message, setMessage] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [tradeCount, setTradeCount] = useState(0);
    const [tradeHistory, setTradeHistory] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);

    const handleStart = () => {
        const amount = parseFloat(startingAmount);
        if (amount > 0) {
            setBalance(amount);
            setMessage(`Game started with $${amount}`);
            setStartingAmount('');
            setTradeCount(0);
            setTradeHistory([]);
            setGameStarted(true);
        } else {
            setMessage('Please enter a valid starting amount.');
        }
    };

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

        setTradeAmount('');
    };

    const resetGame = () => {
        setBalance(0);
        setTradeAmount('');
        setMessage('');
        setGameOver(false);
        setTradeCount(0);
        setTradeHistory([]);
        setGameStarted(false);
    };

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Trade Game</h1>
            {!gameStarted ? (
                <div className="text-center">
                    <h2>Enter Starting Amount</h2>
                    <div className="row justify-content-center mb-3">
                        <div className="col-6 col-md-4">
                            <input
                                type="number"
                                className="form-control"
                                value={startingAmount}
                                onChange={(e) => setStartingAmount(e.target.value)}
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={handleStart}>
                        Start Game
                    </button>
                    <p className="mt-3 text-danger">{message}</p>
                </div>
            ) : (
                <div>
                    <div className="text-center mb-4">
                        <h2>Current Balance: ${balance}</h2>
                        <h3>Number of Trades: {tradeCount}</h3>
                        <div className="row justify-content-center mb-3">
                            <div className="col-6 col-md-4">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={tradeAmount}
                                    onChange={(e) => setTradeAmount(e.target.value)}
                                    placeholder="Enter trade amount"
                                    disabled={gameOver}
                                />
                            </div>
                        </div>
                        <button className="btn btn-success me-2" onClick={handleTrade} disabled={gameOver}>
                            Trade
                        </button>
                        <button className="btn btn-secondary" onClick={resetGame}>
                            Reset Game
                        </button>
                        <p className="mt-3 text-danger">{message}</p>
                    </div>

                    {tradeHistory.length > 0 && (
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
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
                                                className={`me-1 ${trade.outcome === 'Win' ? 'text-success' : 'text-danger'}`}
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
