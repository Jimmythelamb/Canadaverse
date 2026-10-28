const CHANNEL_ID = "UCluRGopUSriWobdaww5wuSg";
exports.handler = async () => {
  const key = process.env.YT_API_KEY;
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=${CHANNEL_ID}&part=snippet&order=date&type=video&maxResults=3`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("YouTube API " + res.status);
    const data = await res.json();
    const videos = data.items.map(v => ({ id: v.id.videoId, title: v.snippet.title }));
    return { statusCode: 200, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=600" }, body: JSON.stringify(videos) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};