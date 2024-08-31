const axios = require("axios");
const fs = require("fs");
const path = require("path");

const TELEGRAM_API_TOKEN = "7227645715:AAE9fMuy-9oQ2wtlKc6Kx9TrcfjTmYBs8vo";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`;

async function sendWelcomeMessage(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
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

async function sendMessage(chatId, message) {
  await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
    chat_id: chatId,
    text: message,
  });
}

async function handleFileUpload(chatId, fileId) {
  try {
    const fileResponse = await axios.get(`${TELEGRAM_API_URL}/getFile`, {
      params: { file_id: fileId },
    });

    const filePath = fileResponse.data.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_API_TOKEN}/${filePath}`;

    const file = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const numbers = await processFile(file.data);

    sendMessage(
      chatId,
      `File received and processed. Phone numbers will be called soon, total numbers to call: ${numbers.length}`
    );

    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i];
      await sendMessage(chatId, `Calling number: ${number}`);

      // Send update about the remaining numbers
      const remaining = numbers.length - (i + 1);
      await sendMessage(chatId, `Numbers left to call: ${remaining}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function processFile(fileBuffer) {
  const fileContent = fileBuffer.toString("utf8");
  return (phoneNumbers = fileContent
    .split("\n") // Split the content into lines based on newline characters
    .map((line) => line.trim()) // Trim each line
    .filter((line) => line));
}

module.exports = { sendWelcomeMessage, handleFileUpload, sendMessage };
