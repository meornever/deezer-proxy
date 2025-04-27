
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Stockage des votes dans un fichier JSON
const votesFile = './backend/votes.json';

app.post('/api/vote', (req, res) => {
  const vote = req.body;
  if (!vote || !vote.trackId) {
    return res.status(400).json({ error: 'Vote invalide.' });
  }

  let votes = [];
  if (fs.existsSync(votesFile)) {
    votes = JSON.parse(fs.readFileSync(votesFile));
  }
  votes.push(vote);
  fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));
  res.json({ success: true });
});

// Route de recherche classique
app.get('/api/deezer', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Merci de préciser un paramètre "q" pour la recherche.' });
  }
  const apiUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l'appel à l'API Deezer.' });
  }
});

// Route pour récupérer une playlist Deezer
app.get('/api/deezer/playlist', async (req, res) => {
  const playlistId = req.query.id;
  if (!playlistId) {
    return res.status(400).json({ error: 'Merci de préciser l'ID de la playlist.' });
  }
  const apiUrl = `https://api.deezer.com/playlist/${playlistId}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l'appel à l'API Deezer (playlist).' });
  }
});

app.listen(PORT, () => {
  console.log(`🎶 Proxy Deezer en écoute sur http://localhost:${PORT}`);
});
