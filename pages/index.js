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
        <div>
            <h1>NBA Scores</h1>
            {games.map((game, index) => (
                <div key={index}>
                    <h2>{game.homeTeam.teamName} vs {game.awayTeam.teamName}</h2>
                    <p>Score: {game.homeTeam.score} - {game.awayTeam.score}</p>
                </div>
            ))}
        </div>
    );
}

// pages/api/scores.js
import axios from 'axios';

export default async function handler(req, res) {
    try {
        const response = await axios.get('https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json');
        
        res.status(200).json({
            success: true,
            games: response.data.scoreboard.games
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch scores' 
        });
    }
}