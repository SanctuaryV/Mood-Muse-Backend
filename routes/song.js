// routes/song.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
// ถ้าใช้ database จริงให้ import model ด้วย
// import Song from '../models/song.js';

dotenv.config();

const router = express.Router();

// Get Spotify access token
const getSpotifyToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    throw error;
  }
};

// Get songs by mood and genre
router.get('/:mood/:genre', async (req, res) => {
    try {
      const { mood, genre } = req.params;
      
      // Get Spotify access token
      const token = await getSpotifyToken();
      
      // Map mood and genre to Spotify search query
      const moodMap = {
        'happy': 'สบายใจ',
        'sad': 'เศร้า',
        'angry': 'โกรธ',
        'anxious': 'สงบ',
        'tired': 'ผ่อนคลาย',
        'relaxed': 'สงบสุข'
      };
      
      const genreMap = {
        'pop': 'ป๊อป',
        'rock': 'ร็อค',
        'jazz': 'แจ๊ส',
        'classical': 'คลาสสิก',
        'hip-hop': 'ฮิปฮอป',
        'electronic': 'EDM'
      };
      
      // Search for playlists
      const searchResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${moodMap[mood]}+${genreMap[genre]}&type=playlist&limit=5`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      const playlistsRaw = searchResponse.data.playlists.items || [];
  
      const playlists = playlistsRaw
        .filter(playlist => playlist && playlist.id && playlist.external_urls && playlist.tracks)
        .map(playlist => ({
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          imageUrl: playlist.images?.[0]?.url || null,
          spotifyUrl: playlist.external_urls.spotify,
          tracks: playlist.tracks.total
        }));
      
      res.json(playlists);
    } catch (error) {
      console.error('Error in song route:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// POST /api/song
router.post('/', async (req, res) => {
  try {
    const song = new Song(req.body); // ต้องมี model Song
    const savedSong = await song.save();
    res.status(201).json(savedSong);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
