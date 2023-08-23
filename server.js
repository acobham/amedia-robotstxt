const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Robots.txt Tester API is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;  // for testing purposes

app.post('/test-robots', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required.' });
    }

    try {
        const response = await axios.get(`${url}/robots.txt`);
        const robotsContent = response.data;

        // Analyze the robots.txt content
        const analysis = analyzeRobots(robotsContent);

        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch robots.txt or analyze it.' });
    }
});

function analyzeRobots(content) {
    const issues = [];
    const recommendations = [];

    if (!content.includes('User-agent:')) {
        issues.push('No User-agent directive found.');
        recommendations.push('Consider adding a User-agent directive to specify which crawlers the rules apply to.');
    }

    if (!content.includes('Disallow:')) {
        recommendations.push('No Disallow directive found. If there are URLs you want to prevent search engines from crawling, add a Disallow directive.');
    }

    return {
        issues,
        recommendations
    };
}
