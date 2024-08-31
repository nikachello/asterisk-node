const axios = require("axios");

const TELEGRAM_API_TOKEN = "7227645715:AAE9fMuy-9oQ2wtlKc6Kx9TrcfjTmYBs8vo";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`;

async function sendWelcomeMessage(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_API_URL}/sendWelcomeMessage`, {
      chat_id: chatId,
      text: "Welcome to the bot! You can warm your audience with automated calls",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Upload a file", callback_data: "upload_file" },
            { text: "Stats", callback_data: "stats" },
          ],
        ],
      },
    });
    console.log(`Welcome message with inline keyboard sent.`);
  } catch (error) {
    console.error("Error sending messages", error);
  }
}

module.exports = { sendWelcomeMessage };
