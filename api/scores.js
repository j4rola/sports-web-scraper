const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

async function scrapeScores() {
    try {
        console.log('Starting scrape...');
        const response = await axios.get('https://www.espn.com/nba/scoreboard', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'max-age=0'
            }
        });
        
        const $ = cheerio.load(response.data);
        console.log('Loaded HTML content');

        // Debug endpoint to see available classes
        const availableClasses = new Set();
        $('*').each((i, element) => {
            const classes = $(element).attr('class');
            if (classes) {
                classes.split(' ').forEach(c => availableClasses.add(c));
            }
        });
        console.log('Available classes:', Array.from(availableClasses));

        // Try different selectors for scores
        const scores = [];
        
        // Look for game cards
        $('[class*="score"],[class*="Scorecard"],[class*="Game"]').each((i, element) => {
            console.log('Found potential game element:', $(element).attr('class'));
            
            // Try to extract text content
            const text = $(element).text();
            if (text) {
                console.log('Element text:', text);
            }
        });

        return {
            scores: scores,
            debugInfo: {
                availableClasses: Array.from(availableClasses),
                url: 'https://www.espn.com/nba/scoreboard',
                timestamp: new Date().toISOString(),
                htmlPreview: response.data.substring(0, 1000) // First 1000 chars of HTML
            }
        };
    } catch (error) {
        console.error('Error scraping scores:', error);
        return { 
            error: 'Failed to fetch scores', 
            details: error.message,
            stack: error.stack
        };
    }
}

// Debug endpoint
app.get('/api/debug', async (req, res) => {
    try {
        const result = await scrapeScores();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            error: 'Debug endpoint failed',
            message: error.message,
            stack: error.stack
        });
    }
});

app.get('/api/scores', async (req, res) => {
    try {
        const result = await scrapeScores();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});