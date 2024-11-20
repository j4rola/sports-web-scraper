const axios = require('axios');
const express = require('express');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

async function fetchScores() {
    try {
        console.log('Fetching scores...');
        const response = await axios.get('https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });
        
        return response.data.scoreboard.games;
    } catch (error) {
        console.error('Error fetching scores:', error);
        return [];
    }
}

// HTML endpoint that displays scores nicely
app.get('/', async (req, res) => {
    const games = await fetchScores();
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>NBA Scores</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background: #f5f5f5;
                }
                .game-card {
                    background: white;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .team {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #eee;
                }
                .team:last-child {
                    border-bottom: none;
                }
                .score {
                    font-weight: bold;
                    font-size: 1.2em;
                }
                .status {
                    text-align: center;
                    color: #666;
                    padding-top: 10px;
                }
                .timestamp {
                    text-align: center;
                    color: #999;
                    font-size: 0.8em;
                    margin-top: 20px;
                }
                h1 {
                    text-align: center;
                    color: #333;
                }
                .no-games {
                    text-align: center;
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                }
            </style>
        </head>
        <body>
            <h1>NBA Scores</h1>
            ${games.length === 0 
                ? '<div class="no-games">No games scheduled for today</div>'
                : games.map(game => `
                    <div class="game-card">
                        <div class="team">
                            <div>${game.homeTeam.teamName}</div>
                            <div class="score">${game.homeTeam.score}</div>
                        </div>
                        <div class="team">
                            <div>${game.awayTeam.teamName}</div>
                            <div class="score">${game.awayTeam.score}</div>
                        </div>
                        <div class="status">${game.gameStatusText}</div>
                    </div>
                `).join('')}
            <div class="timestamp">Last updated: ${new Date().toLocaleString()}</div>
            <script>
                // Refresh the page every 30 seconds
                setTimeout(() => window.location.reload(), 30000);
            </script>
        </body>
        </html>
    `;
    
    res.send(html);
});

// JSON API endpoint
app.get('/api/scores', async (req, res) => {
    try {
        const games = await fetchScores();
        res.json({
            success: true,
            games: games,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch scores' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available endpoints:');
    console.log('  / - View scores in browser');
    console.log('  /api/scores - Get raw JSON data');
});