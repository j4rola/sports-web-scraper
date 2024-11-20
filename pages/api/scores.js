// pages/api/scores.js
import axios from 'axios';

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
        console.error('Error fetching scores:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch scores' 
        });
    }
}