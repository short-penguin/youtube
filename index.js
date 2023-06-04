const express = require('express');
const axios = require('axios');
const { YoutubeTranscript } = require('youtube-transcript');

const app = express();
const port = 3000;

app.get('/transcript', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(url);
    if (transcript.length === 0) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const { data: oembedData } = await axios.get(oembedUrl);

    const { title, thumbnail_url, author_name } = oembedData;

    let ans = '';
    for (const t of transcript) {
      ans += t.text;
    }

    res.json({
      title,
      thumbnail_url,
      author_name,
      transcript: ans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
