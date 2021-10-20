const express = require("express");
const downgrade = require("downgrade");
const app = express();
const config = require("./config");
const api = require("./api");
app.use(express.json({ extended: false }));
app.use("/api/", api);
app.listen(config.port, function () {
  console.log("App running on port " + config.port + "!");
  downgrade();
});
