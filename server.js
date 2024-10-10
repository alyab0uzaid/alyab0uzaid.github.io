import express from "express";
import fetch from "node-fetch";



const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

const redirect_uri = "http://localhost:3000/callback";
const client_id = "1ca6960013344c3f9d74dbbddb4f58bd";
const client_secret = "e458068308b247c0b4fc223c2f0999c1";

global.access_token;

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/authorize", (req, res) => {
  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: "user-top-read",
    redirect_uri: redirect_uri,
    show_dialog: "true" // This forces the login screen to show every time
  });

  res.redirect(
    "https://accounts.spotify.com/authorize?" + auth_query_parameters.toString()
  );
});


app.get("/callback", async (req, res) => {
  const code = req.query.code;

  var body = new URLSearchParams({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  });

  const data = await response.json();
  global.access_token = data.access_token;

  res.redirect("/dashboard");
});

async function getData(endpoint) {
  const response = await fetch("https://api.spotify.com/v1" + endpoint, {
    method: "get",
    headers: {
      Authorization: "Bearer " + global.access_token,
    },
  });

  const data = await response.json();
  return data;
}

app.get("/dashboard", async (req, res) => {
  const userInfo = await getData("/me");
  const topTracks = await getData("/me/top/tracks?limit=10");
  
  console.log('Top Tracks:', topTracks.items); // Check if tracks are being fetched

  res.render("dashboard", { user: userInfo, tracks: topTracks.items });
});

app.get("/recommendations", async (req, res) => {
  const artist_id = req.query.artist;
  const track_id = req.query.track;

  const params = new URLSearchParams({
    seed_artist: artist_id,
    seed_genres: "rock",
    seed_tracks: track_id,
  });

  const data = await getData("/recommendations?" + params);
  res.render("recommendation", { tracks: data.tracks });
});

let listener = app.listen(3000, function () {
  console.log(
    "Your app is listening on http://localhost:" + listener.address().port
  );
});

app.get('/get-top-tracks', async (req, res) => {
  const timeRange = req.query.time_range; // short_term, medium_term, long_term
  const tracks = await getData(`/me/top/tracks?time_range=${timeRange}&limit=10`);
  res.json(tracks); // Send the top tracks as JSON
});

app.post("/create-playlist", async (req, res) => {
  const { playlistName, tracks } = req.body;

  // Create a new playlist
  const userInfo = await getData("/me");
  const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userInfo.id}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${global.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: playlistName,
      public: false,
    }),
  });

  if (playlistResponse.ok) {
    const playlistData = await playlistResponse.json();

    // Add tracks to the playlist
    const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${global.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: tracks,
      }),
    });

    if (addTracksResponse.ok) {
      res.status(200).send("Playlist created and tracks added.");
    } else {
      res.status(500).send("Failed to add tracks to playlist.");
    }
  } else {
    res.status(500).send("Failed to create playlist.");
  }
});

app.get("/logout", (req, res) => {
  // Clear the stored access token
  global.access_token = null;

  // Clear any session-related cookies (if applicable)
  res.clearCookie('connect.sid');  // Example of clearing a session cookie (if using express-session)

  // Redirect the user back to your index page (home page)
  res.redirect('/');  // This redirects the user to the homepage (index.pug)
});


