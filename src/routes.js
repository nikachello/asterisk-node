const express = require("express");
const router = express.Router();
const { sendWelcomeMessage } = require("./telegram");

router.post("/webhook", async (req, res) => {
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
  }
  res.status(200).send("OK");

  if (message && message.text) {
    const chatId = message.chat.id;
    const text = message.text.toLowerCase();

    if (text === "/start") {
      await sendWelcomeMessage(chatId);
    } else {
      console.log(`Received message: ${text}`);
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
