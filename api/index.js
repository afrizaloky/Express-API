const express = require("express");
const router = express.Router();
const webtorrentHealth = require("webtorrent-health");
const parseTorrent = require("parse-torrent");

/**
 * GET torren health.
 *
 * @return seeder and leecher | empty.
 */

// GET /check
router.get("/check", function (req, res) {
  if (!req.query.magnet)
    return res.send({ error: { code: 404, message: "Missing magnet link" } });

  webtorrentHealth(
    req.query.magnet,
    {
      timeout: 2000,
    },
    function (err, data) {
      if (err) return res.send({ error: { code: 500, message: err.message } });
      let info = parseTorrent(req.query.magnet);

      result = {
        status: 200,
        result: {
          name: info.name,
          hash: info.infoHash,
          seeder: data.seeds,
          leecher: data.peers,
        },
      };
      res.json(result);
    }
  );
});

router.get("/convertTime", function (req, res) {
  if (!req.query.second)
    return res.send({ error: { code: 404, message: "Missing magnet link" } });
  d = Number(second);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);
  result = {
    status: 200,
    result: `${h}:${m}:${s}`,
  };
  res.json(result);
});

module.exports = router;
