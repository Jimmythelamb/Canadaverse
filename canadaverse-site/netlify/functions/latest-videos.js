// Latest uploads from the channel's public YouTube RSS feed (no API key needed).
const CHANNEL_ID = "UCluRGopUSriWobdaww5wuSg";
exports.handler = async () => {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
    if (!res.ok) throw new Error("YouTube feed " + res.status);
    const xml = await res.text();
    const videos = [...xml.matchAll(/<entry>[\s\S]*?<yt:videoId>([^<]+)<\/yt:videoId>[\s\S]*?<title>([^<]+)<\/title>/g)]
      .slice(0, 3)
      .map(m => ({ id: m[1], title: m[2].replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">") }));
    return { statusCode: 200, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=600" }, body: JSON.stringify(videos) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
