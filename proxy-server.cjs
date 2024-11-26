const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Enable CORS for your React app
app.use(cors({
  origin: 'http://localhost:5173' // Your Vite dev server URL
}));

// Proxy endpoint
app.get('/proxy', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).send('URL parameter is required');
    }

    const response = await axios.get(url, {
      responseType: 'text'
    });

    res.set('Content-Type', 'text/calendar');
    res.send(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send(error.message);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
