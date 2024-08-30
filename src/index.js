const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const TELEGRAM_API_TOKEN = "7227645715:AAE9fMuy-9oQ2wtlKc6Kx9TrcfjTmYBs8vo";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`;

app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const message = req.body.message;

  if (message && message.text) {
    const chatId = message.chat.id;
    const text = message.text;

    await sendMessage(chatId, `You texted me: ${text}`);
  }

  res.status(200);
});

async function sendMessage(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
  } catch (error) {
    console.error("Error sending message", error);
  }
}

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
