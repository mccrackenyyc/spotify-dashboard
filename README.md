# 🎵 Spotify Dashboard

A real-time web dashboard that displays your currently playing Spotify track. Built as a learning project to understand OAuth 2.0, REST APIs, and Node.js fundamentals.

## Features

- 🎶 Real-time display of currently playing track
- 🖼️ Album artwork visualization
- 🔄 Auto-refresh every 5 seconds
- 🔐 OAuth 2.0 authentication with Spotify
- 🎨 Clean, Spotify-inspired UI

## Tech Stack

- **Backend:** Node.js + Express
- **Authentication:** Spotify OAuth 2.0
- **API:** Spotify Web API
- **Frontend:** Vanilla HTML/CSS/JavaScript

## Prerequisites

- Node.js (v16 or higher)
- A Spotify account (free or premium)
- Spotify Developer App credentials

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mccrackenyyc/spotify-dashboard.git
cd spotify-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Spotify Developer App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **"Create app"**
4. Fill in the details:
   - **App name:** Spotify Dashboard (or whatever you prefer)
   - **App description:** Personal listening dashboard
   - **Redirect URI:** `http://localhost:3000/callback`
   - **API:** Check "Web API"
5. Save and note your **Client ID** and **Client Secret**

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://localhost:3000/callback
PORT=3000
```

### 5. Run the Application

```bash
node server.js
```

The server will start on `http://localhost:3000`

### 6. Login and Use

1. Open `http://localhost:3000` in your browser
2. Click **"Login with Spotify"**
3. Authorize the application
4. You'll be redirected to the dashboard
5. Start playing a song on Spotify to see it appear!

## Project Structure

```
spotify-dashboard/
├── .env                 # Your environment variables (not tracked)
├── .env.example         # Template for .env
├── server.js            # Express server + OAuth logic
├── public/
│   ├── index.html       # Login landing page
│   └── dashboard.html   # Main dashboard view
├── package.json         # Project dependencies
└── README.md            # This file
```

## How It Works

### OAuth 2.0 Flow

1. User clicks "Login with Spotify"
2. Redirected to Spotify's authorization page
3. User grants permission
4. Spotify redirects back with authorization code
5. Server exchanges code for access token
6. Access token stored and used for API requests

### API Integration

The app uses Spotify's [Get Currently Playing Track](https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track) endpoint to fetch real-time playback information.

## Learning Outcomes

This project taught me:

- **OAuth 2.0 authentication flow** - Understanding authorization codes, access tokens, and redirect URIs
- **REST API consumption** - Making authenticated HTTP requests and handling responses
- **Express.js basics** - Routing, middleware, and serving static files
- **Environment variables** - Securing API credentials with dotenv
- **Asynchronous JavaScript** - Working with Promises and async/await
- **API error handling** - Gracefully handling token expiration and API failures

## Future Enhancements

Potential improvements:
- [ ] Recently played tracks list
- [ ] Top artists and songs statistics
- [ ] Playback controls (play/pause/skip)
- [ ] Token refresh logic for long-lived sessions
- [ ] Docker containerization
- [ ] Deployment to personal server/NAS

## Security Notes

- Never commit `.env` file to version control
- Keep your `CLIENT_SECRET` private
- In production, use proper session management instead of in-memory storage
- Consider implementing token refresh for long-running sessions

## License

MIT License - See [LICENSE](LICENSE) file for details

## Author

Built by Scott McCracken as a portfolio learning project.