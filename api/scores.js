// api/scores.js
const axios = require('axios');
const cheerio = require('cheerio');

// Vercel serverless function
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const response = await axios.get('https://www.espn.com/nba/scoreboard', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const scores = [];

        $('.ScoreboardScoreCell').each((i, element) => {
            const teamNames = $(element).find('.ScoreCell_TeamName');
            const scoreValues = $(element).find('.ScoreCell_Score');

            if (teamNames.length === 2 && scoreValues.length === 2) {
                scores.push({
                    homeTeam: $(teamNames[0]).text(),
                    homeScore: $(scoreValues[0]).text(),
                    awayTeam: $(teamNames[1]).text(),
                    awayScore: $(scoreValues[1]).text(),
                    timestamp: new Date().toISOString()
                });
            }
        });

        res.status(200).json(scores);
    } catch (error) {
        console.error('Error scraping scores:', error);
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
}
