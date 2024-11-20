// pages/index.js
import React, { useState, useEffect } from 'react';

export default function Home() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch('/api/scores');
                const data = await response.json();
                setGames(data.games || []);
            } catch (error) {
                console.error('Error fetching scores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
        const interval = setInterval(fetchScores, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div>Loading scores...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>NBA Scores</h1>
            
            {games.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
                    No games scheduled for today
                </div>
            ) : (
                <div>
                    {games.map((game, index) => (
                        <div key={index} style={{ 
                            background: 'white', 
                            padding: '15px', 
                            marginBottom: '15px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                padding: '10px 0',
                                borderBottom: '1px solid #eee'
                            }}>
                                <span>{game.homeTeam.teamName}</span>
                                <strong>{game.homeTeam.score}</strong>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                padding: '10px 0'
                            }}>
                                <span>{game.awayTeam.teamName}</span>
                                <strong>{game.awayTeam.score}</strong>
                            </div>
                            <div style={{ 
                                textAlign: 'center',
                                fontSize: '0.9em',
                                color: '#666',
                                marginTop: '10px'
                            }}>
                                {game.gameStatusText}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div style={{ textAlign: 'center', fontSize: '0.8em', color: '#999', marginTop: '20px' }}>
                Last updated: {new Date().toLocaleString()}
            </div>
        </div>
    );
}

// pages/api/scores.js
import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    try {
        const response = await axios.get('https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });
        
        res.status(200).json({
            success: true,
            games: response.data.scoreboard.games,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch scores' 
        });
    }
}