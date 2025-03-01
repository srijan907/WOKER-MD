const { cmd } = require('../command');

cmd({
    pattern: "mee",
    alias: ["me"],
    desc: "Tag yourself in the chat",
    category: "Tools",
    react: "👤",
    filename: __filename
}, async (client, message, args) => {
    try {
        const senderJid = message.sender; // Get the sender's JID
        const mentionText = `@${senderJid.split("@")[0]}`; // Format mention text
        const options = {
            mentions: [senderJid] // Add sender to mentions list
        };

        // Send the message with mention
        await client.sendMessage(message.chat, { text: mentionText, ...options });
    } catch (error) {
        console.error("Mee Plugin Error:", error);
    }
});
