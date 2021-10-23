require("dotenv").config();
const express = require("express");
const downgrade = require("downgrade");
const app = express();
const api = require("./api");

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");

app.use(express.json({ extended: false }));
app.use("/api/", api);
app.get("/", function (req, res) {
  res.json({ status: 200 });
});
app.listen(port, function () {
  console.log("App running on port " + port + "!");
  // downgrade();
});
