const express = require("express");
const router = express.Router();
const { sendWelcomeMessage } = require("./telegram");
const TELEGRAM_API_TOKEN = "7227645715:AAE9fMuy-9oQ2wtlKc6Kx9TrcfjTmYBs8vo";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`;

router.post("/webhook", async (req, res) => {
  const { message, callback_query } = req.body;
  if (callback_query) {
    const { id, data } = callback_query;

    let responseText = "";

    switch (data) {
      case "upload_file":
        responseText = "Let's warm the audience🔥 Please upload your file";
        break;
      case "stats":
        responseText = "Here are your stats📊";
      default:
        responseText = "We are working on that⚙️";
    }

    await axios.post(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
      callback_query_id: id,
      text: responseText,
    });

    return res.status(200).send("OK");
  }

  if (message) {
    const chatId = message.chat.id;

    if (message.text === "/start") {
      await sendWelcomeMessage(chatId);
    } else if (message.document) {
      await handleFileUpload(chatId, message.document.file_id);
    } else {
      console.log(`Received a message: ${message.text}`);
    }
  }

  res.status(200).send("OK");
});
router.get("/hangup", (req, res) => {
  const { reason, userid } = req.query;
  console.log(`Hangup: Reason = ${reason}, userID=${userid}`);
  res.status(200).send(`Hangup: Reason = ${reason}, userID=${userid}`);
});

router.get("/events", (req, res) => {
  const { action, userid } = req.query;
  console.log(`Event: Action = ${action}, userID  = ${userid}`);
  res.status(200).send(`Event: Action = ${action}, userID  = ${userid}`);
});

router.get("/answer", (req, res) => {
  const { userid } = req.query;
  console.log(`Answer: UserID = ${userid}`);
  res.status(200).send(`Answer: UserID = ${userid}`);
});

module.exports = router;
