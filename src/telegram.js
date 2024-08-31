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

async function handleFileUpload(chatId, fileId) {
  try {
    // Get the file path

    const fileResponse = await axios.get(`${TELEGRAM_API_URL}/getFile`, {
      params: { file_id: fileId },
    });

    const filePath = fileResponse.data.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_API_TOKEN}/${filePath}`;

    // Download the file

    const file = await axios.getAdapter(fileUrl, {
      responseType: "arraybuffer",
    });

    await processFile(file.data);

    await axios.post(`${TELEGRAM_API_URL / sendMessage}`, {
      chat_id: chatId,
      text: "File received and processed. Phone numbers will be called soon",
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function processFile(fileBuffer) {
  const fileContent = fileBuffer.toString("utf8");
  const phoneNumbers = fileContent.split(
    "\n".map((line) => line.trim()).filter((line) => line)
  );

  for (const phoneNumber of phoneNumbers) {
    console.log(phoneNumber);
  }
}

module.exports = { sendWelcomeMessage, handleFileUpload };
