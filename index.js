const express = require("express");
const webtorrentHealth = require("webtorrent-health");
const downgrade = require("downgrade");
const app = express();
const config = require("./config");

// Serve all the pug pages
app.get("/", function (req, res) {
  res.json({ status: 200 });
});

// GET /check
app.get("/check", function (req, res) {
  if (!req.query.magnet)
    return res.send({ error: { code: 404, message: "Missing magnet link" } });

  webtorrentHealth(
    req.query.magnet,
    {
      timeout: 2000,
    },
    function (err, data) {
      if (err) return res.send({ error: { code: 500, message: err.message } });

      result = {
        status: 200,
        result: {
          seeder: data.seeds,
          leecher: data.peers,
        },
      };
      // Send results
      res.json(result);
    }
  );
});

app.listen(config.port, function () {
  console.log("App running on port " + config.port + "!");
  downgrade();
});
