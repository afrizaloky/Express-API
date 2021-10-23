const express = require("express");
const router = express.Router();
const webtorrentHealth = require("webtorrent-health");
const parseTorrent = require("parse-torrent");
const requestIp = require("request-ip");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
    return res.send({
      error: { code: 404, message: "Missing second argument" },
    });
  d = Number(req.query.second);
  var h = Math.floor(d / 3600)
    .toString()
    .padStart(2, "0");
  var m = Math.floor((d % 3600) / 60)
    .toString()
    .padStart(2, "0");
  var s = Math.floor((d % 3600) % 60)
    .toString()
    .padStart(2, "0");
  result = {
    status: 200,
    result: `${h}:${m}:${s}`,
  };
  res.json(result);
});

router.get("/getIP", function (req, res) {
  var clientIp = requestIp.getClientIp(req);
  result = {
    status: 200,
    result: {
      date: new Date(),
      host: req.get("origin"),
      ipAddress: clientIp,
    },
  };
  if (req.query.second) result.result.second = req.query.second;
  console.log(result);

  client.connect(err => {
    const collection = client.db("expressAPI").collection("ipAddress");
    // perform actions on the collection object
    collection.insertOne(result).then(result => {
      console.log(result);
      client.close();
    });
  });
  res.json(result);
});

module.exports = router;
