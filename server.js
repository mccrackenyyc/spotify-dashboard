require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Store tokens in memory (in production, use proper session management)
let accessToken = null;
let refreshToken = null;

// Spotify API configuration
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Scopes define what data we can access
const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-recently-played',
  'user-top-read'
].join(' ');

// Step 1: Redirect user to Spotify authorization page
app.get('/login', (req, res) => {
  const authUrl = 'https://accounts.spotify.com/authorize?' + 
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI
    });
  
  res.redirect(authUrl);
});

// Step 2: Handle callback from Spotify
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  if (!code) {
    return res.send('Error: No authorization code received');
  }

  try {
    // Exchange authorization code for access token
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      }),
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;

    console.log('✅ Successfully authenticated with Spotify!');
    
    // Redirect to dashboard
    res.redirect('/dashboard.html');
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    res.send('Error during authentication');
  }
});

// Step 3: API endpoint to get currently playing track
app.get('/api/now-playing', async (req, res) => {
  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    // If nothing is playing, Spotify returns 204 No Content
    if (response.status === 204 || !response.data) {
      return res.json({ isPlaying: false });
    }

    // Extract relevant data
    const track = response.data.item;
    const isPlaying = response.data.is_playing;

    res.json({
      isPlaying: isPlaying,
      trackName: track.name,
      artistName: track.artists.map(artist => artist.name).join(', '),
      albumName: track.album.name,
      albumArt: track.album.images[0]?.url, // Largest image
      trackUrl: track.external_urls.spotify
    });

  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired, need to re-authenticate
      return res.status(401).json({ error: 'Token expired, please login again' });
    }
    
    console.error('Error fetching now playing:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch currently playing track' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    authenticated: !!accessToken
  });
});

// Debug endpoint to view token status
app.get('/api/debug/token', (req, res) => {
  res.json({ 
    accessToken: accessToken,
    hasToken: !!accessToken 
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🎵 Spotify Dashboard running on http://127.0.0.1:${PORT}`);
  console.log(`📝 Visit http://127.0.0.1:${PORT} to get started`);
});