const express = require("express");
const router = express.Router();
const axios = require("axios");
const {
  sendWelcomeMessage,
  handleFileUpload,
  sendMessage,
} = require("./telegram");

router.post("/webhook", async (req, res) => {
  const { message, callback_query } = req.body;
  if (callback_query) {
    console.log("Callback query line 10");
    const { id, data } = callback_query;

    let responseText = "";
    let replyMessage = false;

    switch (data) {
      case "upload_file":
        responseText = "Let's warm the audience🔥 Please upload your file";
        replyMessage = true;
        break;
      case "stats":
        responseText = "Here are your stats📊";
        replyMessage = true;
      default:
        responseText = "We are working on that⚙️";
    }

    if (replyMessage) {
      sendMessage(callback_query.message.chat.id, responseText);
    }

    return res.status(200).send("OK");
  }

  if (message) {
    const chatId = message.chat.id;

    if (message.text === "/start") {
      console.log("Start is given");
      await sendWelcomeMessage(chatId);
    } else if (message.document) {
      console.log("Handle upload is started");
      await handleFileUpload(chatId, message.document.file_id);
    } else {
      console.log(`Received a message: ${message.text}`);
    }
  } else {
    console.log("No message");
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
