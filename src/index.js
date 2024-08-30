const express = require("express");
const app = express();

app.get("/hangup", (req, res) => {
  const { reason, userID } = req.query;
  console.log(`Hangup: Reason = ${reason}, userID=${userID}`);
  res.status(200).send(`Hangup: Reason = ${reason}, userID=${userID}`);
});

app.get("/events", (req, res) => {
  const { action, userID } = req.query;
  console.log(`Event: Action = ${action}, userID  = ${userID}`);
  res.status(200).send(`Event: Action = ${action}, userID  = ${userID}`);
});

app.get("/answer", (req, res) => {
  const { userID } = req.query;
  console.log(`Answer: UserID = ${userID}`);
  res.status(200).send(`Answer: UserID = ${userID}`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
