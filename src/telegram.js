const axios = require("axios");
const fs = require("fs");
const path = require("path");

const TELEGRAM_API_TOKEN = "7227645715:AAE9fMuy-9oQ2wtlKc6Kx9TrcfjTmYBs8vo";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`;

async function handleFileUpload(chatId, fileId) {
  //

  try {
    const fileBuffer = await fetchFile(fileId);
    const numbers = processFile(fileBuffer);

    const initialMessage = `File received and processed. Phone numbers will be called, total numbers to call: ${numbers.length}`;
    const messageId = await sendInitialMessage(chatId, initialMessage);

    await processNumbers(chatId, messageId, numbers);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchFile(fileId) {
  const fileResponse = await axios.get(`${TELEGRAM_API_URL}/getFile`, {
    params: { file_id: fileId },
  });

  const filePath = fileResponse.data.result.file_path;
  const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_API_TOKEN}/${filePath}`;

  const file = await axios.get(fileUrl, { responseType: "arraybuffer" });
  return file.data;
}

function processFile(fileBuffer) {
  const fileContent = fileBuffer.toString("utf8");
  return fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);
}

async function processNumbers(chatId, messageId, numbers) {
  for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];
    await updateMessage(
      chatId,
      messageId,
      `Calling number: ${number}\nStatus: Dialing...`
    );

    const status = await simulateCallProcess(number);
    const remaining = numbers.length - (i + 1);
    await updateMessage(
      chatId,
      messageId,
      `Calling number: ${number}\nStatus: ${status}\nNumbers left to call: ${remaining}`
    );
  }
}

async function sendMessage(chatId, text) {
  return axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
    chat_id: chatId,
    text: text,
  });
}

async function simulateCallProcess(number) {
  await delay(2000);
  const statuses = ["Connected", "Failed", "No answer"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

// async function sendMessage(chatId, message) {
//   await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
//     chat_id: chatId,
//     text: message,
//   });
// }

// async function handleFileUpload(chatId, fileId) {
//   try {
//     const fileResponse = await axios.get(`${TELEGRAM_API_URL}/getFile`, {
//       params: { file_id: fileId },
//     });

//     const filePath = fileResponse.data.result.file_path;
//     const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_API_TOKEN}/${filePath}`;

//     const file = await axios.get(fileUrl, {
//       responseType: "arraybuffer",
//     });

//     const numbers = await processFile(file.data);

//     sendMessage(
//       chatId,
//       `File received and processed. Phone numbers will be called soon, total numbers to call: ${numbers.length}`
//     );

//     for (let i = 0; i < numbers.length; i++) {
//       const number = numbers[i];
//       await sendMessage(chatId, `Calling number: ${number}`);

//       // Send update about the remaining numbers
//       const remaining = numbers.length - (i + 1);
//       await sendMessage(chatId, `Numbers left to call: ${remaining}`);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// async function processFile(fileBuffer) {
//   const fileContent = fileBuffer.toString("utf8");
//   return (phoneNumbers = fileContent
//     .split("\n") // Split the content into lines based on newline characters
//     .map((line) => line.trim()) // Trim each line
//     .filter((line) => line));
// }

module.exports = { sendWelcomeMessage, handleFileUpload, sendMessage };
