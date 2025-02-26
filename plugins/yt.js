const axios = require("axios");
const { cmd } = require('../command');
const yts = require("yt-search");

const YT_API_BASE = "https://ditzdevs-ytdl-api.hf.space/api";

cmd({
  pattern: "youtube",
  alias: ['yt'],
  react: '🎥',
  desc: "Download YouTube videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from, quoted, args, q, reply
}) => {
  try {
    if (!q) return reply("*`Provide a YouTube URL or search query`*");

    store.react('⬇️');

    let videoUrl = "";
    if (q.startsWith('https://')) {
      videoUrl = q;
    } else {
      const searchResults = await yts(q);
      if (!searchResults.videos.length) return reply("*`No results found`*");
      videoUrl = searchResults.videos[0].url;
    }

    let ytInfo = await axios.get(`${YT_API_BASE}/info?url=${videoUrl}`);
    if (!ytInfo.data.status) return reply("*`Failed to fetch video info`*");

    let videoTitle = ytInfo.data.download.title;
    let thumbnail = ytInfo.data.result.thumbnail[0].url;

    let captionMessage =
      `╭━━━〔 *KHAN-MD* 〕━━━┈⊷\n` +
      `┃▸╭───────────\n` +
      `┃▸┃ 🎬 *YOUTUBE DOWNLOADER*\n` +
      `┃▸└───────────\n` +
      `╰────────────────\n` +
      `🎵 *Title:* ${videoTitle}\n` +
      `🎥 *Quality Options:*\n` +
      `  1️⃣  360p\n` +
      `  2️⃣  720p\n` +
      `  3️⃣  1080p\n` +
      `🎧 *Audio Download:*\n` +
      `  4️⃣  MP3\n\n` +
      `🔽 Reply with *1, 2, 3, or 4* to download.\n` +
      `> *© Powered by JawadTechX*`;

    const sentMessage = await conn.sendMessage(from, { image: { url: thumbnail }, caption: captionMessage });

    const messageID = sentMessage.key.id;

    conn.ev.on("messages.upsert", async message => {
      const receivedMessage = message.messages[0];
      if (!receivedMessage.message) return;

      const userResponse = receivedMessage.message.conversation || 
                           receivedMessage.message.extendedTextMessage?.["text"];
      const chatID = receivedMessage.key.remoteJid;
      const isReplyToBotMessage = receivedMessage.message.extendedTextMessage &&
                                  receivedMessage.message.extendedTextMessage.contextInfo.stanzaId === messageID;

      if (isReplyToBotMessage) {
        await conn.sendMessage(chatID, { react: { text: '⬇️', key: receivedMessage.key } });

        let downloadUrl = "";

        if (userResponse === '1') {
          let response = await axios.get(`${YT_API_BASE}/ytmp4?url=${videoUrl}&reso=360p`);
          downloadUrl = response.data.download.downloadUrl;
        } else if (userResponse === '2') {
          let response = await axios.get(`${YT_API_BASE}/ytmp4?url=${videoUrl}&reso=720p`);
          downloadUrl = response.data.download.downloadUrl;
        } else if (userResponse === '3') {
          let response = await axios.get(`${YT_API_BASE}/ytmp4?url=${videoUrl}&reso=1080p`);
          downloadUrl = response.data.download.downloadUrl;
        } else if (userResponse === '4') {
          let response = await axios.get(`${YT_API_BASE}/ytmp3?url=${videoUrl}`);
          downloadUrl = response.data.download.downloadUrl;
        } else {
          return;
        }

        await conn.sendMessage(chatID, { react: { text: '⬆️', key: receivedMessage.key } });

        if (userResponse === '4') {
          await conn.sendMessage(chatID, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg"
          }, { quoted: receivedMessage });
        } else {
          await conn.sendMessage(chatID, {
            video: { url: downloadUrl },
            caption: "*© Powered BY JawadTechX*"
          }, { quoted: receivedMessage });
        }
      }
    });

  } catch (error) {
    console.log(error);
    reply("*`Error fetching YouTube video`*");
  }
});
