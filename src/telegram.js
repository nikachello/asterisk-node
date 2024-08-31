const axios = require("axios");

const TELEGRAM_API_TOKEN = "7227645715:AAE9fMuy-9oQ2wtlKc6Kx9TrcfjTmYBs8vo";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`;

async function sendMessage(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
    console.log(`User (ChatID): ${chat_id} || Message: ${text}`);
  } catch (error) {
    console.error("Error sending messages", error);
  }
}

module.exports = { sendMessage };
