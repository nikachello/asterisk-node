const express = require("express");
const router = express.Router();
const { sendMessage } = require("./telegram");

app.post("/webhook", async (req, res) => {
  const message = req.body.message;

  if (message && message.text) {
    const chatId = message.chat.id;
    const text = message.text;

    await sendMessage(chatId, `You texted me: ${text}`);
  }

  res.status(200).send("OK");
});

app.get("/hangup", (req, res) => {
  const { reason, userid } = req.query;
  console.log(`Hangup: Reason = ${reason}, userID=${userid}`);
  res.status(200).send(`Hangup: Reason = ${reason}, userID=${userid}`);
});

app.get("/events", (req, res) => {
  const { action, userid } = req.query;
  console.log(`Event: Action = ${action}, userID  = ${userid}`);
  res.status(200).send(`Event: Action = ${action}, userID  = ${userid}`);
});

app.get("/answer", (req, res) => {
  const { userid } = req.query;
  console.log(`Answer: UserID = ${userid}`);
  res.status(200).send(`Answer: UserID = ${userid}`);
});

module.exports = router;
