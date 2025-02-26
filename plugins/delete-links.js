const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdl"],
    react: "📩",
    desc: "Download videos from Facebook.",
    category: "downloader",
    use: '.fb <Facebook URL>',
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply('*❌ Please provide a Facebook video URL!* ℹ️');

        // React to indicate processing
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: mek.key } });

        const apiUrl = `https://dark-shan-yt.koyeb.app/download/facebook?url=${encodeURIComponent(q)}`;
        
        let response = await axios.get(apiUrl);
        let { status, data } = response.data;

        if (!status || !data.results || data.results.length === 0) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: mek.key } });
            return reply('*❌ Failed to fetch video. The link may be invalid or private.*');
        }

        // Select the highest available quality
        let bestQuality = data.results.find(v => v.url) || data.results[0];

        if (!bestQuality || !bestQuality.url) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: mek.key } });
            return reply('*❌ Video URL not found!*');
        }

        // Send the video
        await conn.sendMessage(m.chat, { 
            video: { url: bestQuality.url }, 
            caption: "Powered by JawadTechX",
            mimetype: 'video/mp4'
        }, { quoted: mek });

        // React after successful download
        await conn.sendMessage(m.chat, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error("❌ Facebook Downloader Error:", e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: mek.key } });
        reply(`❌ *An error occurred!*\n\`\`\`${e.message}\`\`\``);
    }
});
