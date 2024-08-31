const axios = require("axios");
const fs = require("fs");
const path = require("path");

const TELEGRAM_API_TOKEN = "7227645715:AAE9fMuy-9oQ2wtlKc6Kx9TrcfjTmYBs8vo";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`;

let initialMessageId = null;
let lastMessageId = null;
let clickedOne = 0;
let hangUp = 0;
let failed = 0;

async function handleFileUpload(chatId, fileId) {
  //

  try {
    const fileBuffer = await fetchFile(fileId);
    const numbers = processFile(fileBuffer);

    const initialMessage = `File processed. total numbers to call: ${numbers.length} || Clicked 1: ${clickedOne} || HangUp: ${hangUp} || Failed: ${failed}`;
    initialMessageId = await sendMessage(chatId, initialMessage);

    await processNumbers(chatId, numbers);
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

async function processNumbers(chatId, numbers) {
  console.log("Entered processNumbers");
  console.log("Numbers length:", numbers.length);
  for (let i = 0; i < numbers.length; i++) {
    console.log("Entered for loop in processNumbers");
    const number = numbers[i];

    if (lastMessageId !== null) {
      await deleteMessage(chatId, lastMessageId); // Optionally delete the old message
    }

    // Send a new message and update lastMessageId
    const newMessage = `Calling number: ${number}\nStatus: Dialing...`;
    lastMessageId = await sendMessage(chatId, newMessage);
    deleteMessage(chatId, lastMessageId);

    const status = await simulateCallProcess(number);
    const remaining = numbers.length - (i + 1);

    await editMessage(
      chatId,
      initialMessageId,
      `File processed. Total numbers to call: ${numbers.length} || Clicked 1: ${clickedOne} || HangUp: ${hangUp} || Failed: ${failed}\n\nCalling number: ${number}\nStatus: ${status}\nNumbers left to call: ${remaining}`
    );

    // Send the updated message
    const updateMessage = `Calling number: ${number}\nStatus: ${status}\nNumbers left to call: ${remaining}`;
    lastMessageId = await sendMessage(chatId, updateMessage);
    deleteMessage(chatId, lastMessageId);
  }
}

async function sendMessage(chatId, text) {
  console.log("Entered sendMessage function");
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });

    // Return the message_id for further use if needed
    return response.data.result.message_id;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error; // Rethrow the error to handle it further up the call stack
  }
}

async function editMessage(chatId, messageId, newText) {
  console.log(
    `chatId: ${chatId}, messageId: ${messageId}, newText: ${newText}`
  );
  return axios.post(`${TELEGRAM_API_URL}/editMessageText`, {
    chat_id: chatId,
    message_id: messageId,
    text: newText,
  });
}

async function deleteMessage(chatId, messageId) {
  try {
    await axios.post(`${TELEGRAM_API_URL}/deleteMessage`, {
      chat_id: chatId,
      message_id: messageId,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
  }
}

async function simulateCallProcess(number) {
  console.log("We entered simulateCallProcess");
  await delay(5000);
  const statuses = ["Clicked 1", "Failed", "No answer"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  if (status === "Clicked 1") {
    clickedOne++;
  } else if (status === "Failed") {
    failed++;
  } else if (status === "No asnwer") {
    hangUp++;
  }
}

function delay(ms) {
  console.log("We entered delay");
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
