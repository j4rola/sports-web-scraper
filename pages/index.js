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
            <h1 style={{ textAlign: 'center' }}>NBA Scores</h1>
            {games.length === 0 ? (
                <div>No games available</div>
            ) : (
                games.map((game, index) => (
                    <div key={index} style={{ 
                        margin: '10px 0',
                        padding: '15px',
                        border: '1px solid #ddd',
                        borderRadius: '8px'
                    }}>
                        <div>{game.homeTeam.teamName} vs {game.awayTeam.teamName}</div>
                        <div>Score: {game.homeTeam.score} - {game.awayTeam.score}</div>
                    </div>
                ))
            )}
        </div>
    );
}