const { cmd } = require("../command");

cmd({
    pattern: "mee",
    alias: ["tagme", "mentionme"],
    desc: "Mention yourself in chat",
    category: "tools",
    react: "📢",
    filename: __filename
}, async (client, message, args, { from, sender, isGroup }) => {
    try {
        const mentionText = `@${sender.split("@")[0]}`;
        const mentionOptions = {
            text: mentionText,
            mentions: [sender]
        };

        await client.sendMessage(from, mentionOptions, { quoted: message });
    } catch (error) {
        console.error("Mee Plugin Error:", error);
        return message.reply("❌ Failed to mention yourself. Try again.");
    }
});
