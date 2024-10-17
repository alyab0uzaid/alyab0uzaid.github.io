# Termify

Termify is a terminal-like interface for Spotify that allows users to interact with their Spotify account via terminal commands. You can fetch your top tracks, create playlists, and more, all through a nostalgic command-line experience.

![Termify Screenshot](https://your-image-url.com)

## Motivation

I created Termify because I love the tactile feel of using a terminal. Combining this with Spotify, I wanted to give users an intuitive yet nostalgic way of managing and interacting with their music.

## Features

- Fetch your top tracks from the past 4 weeks, 6 months, or a year.
- Save your current top tracks as a playlist.
- Simple, terminal-like user interface.

---

## Availability

Due to limitations with Spotify's API, this app is **not yet available to the public**. However, you can easily run it locally by following the instructions below.

---

## Prerequisites

You will need the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- npm (comes with Node.js)

---

## Getting Started

### 1. Set Up Your Spotify Developer Account

Since this app interacts with Spotify's API, you'll need to set up a Spotify Developer Account to generate your own `CLIENT_ID` and `CLIENT_SECRET`.

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Log in with your Spotify account.
3. Click on your user name in the upper right corner and click on **Dashboard**
4. Click on **Create App** and fill in the required details.
4. Note down the `CLIENT_ID` and `CLIENT_SECRET` values.

5. Set the **Redirect URI** to `http://localhost:3000/callback` in the app settings.
6. Create a `.env` file in the root directory of your project and include the following:


### 2. Clone the repository:

```bash
git clone https://github.com/alyab0uzaid/termify.git
cd termify
```

### 3. Install dependencies:

```bash
npm install
```

### 4. Setup .env file

Create a `.env` file in the root directory of your project and include the following:

CLIENT_ID = `your_spotify_client_id`

CLIENT_SECRET = `your_spotify_client_secret`

REDIRECT_URI = http://localhost:3000/callback

### 5. Run the app
```bash
npm run start
```

### 6. Visit `http://localhost:3000` to start using the app.

## How to Use Termify

Once the app is running locally, you can enter terminal commands directly in the browser.

### Available Commands:

1. **Display top tracks:**
   - `4weeks`: Fetch top tracks from the past 4 weeks.
   - `6months`: Fetch top tracks from the past 6 months.
   - `year`: Fetch top tracks from the past year.

2. **Save current tracks as a playlist:**
   - `save playlist -playlistname`: Saves the currently displayed tracks as a playlist with the specified name.

3. **Logout:**
   - `logout`: Logs you out of Spotify.


