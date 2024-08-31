const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(routes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
