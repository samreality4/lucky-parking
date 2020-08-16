dbHelpers = require("../database/index.js");

module.exports = {
  getAll: (req, res) => {
    let longitude = JSON.parse(req.query.longitude);
    let latitude = JSON.parse(req.query.latitude);

    dbHelpers
      .query(
        `SELECT * FROM citations WHERE longitude BETWEEN ${longitude} - 0.02 AND ${longitude} + 0.02 AND latitude BETWEEN ${latitude} - 0.005 AND ${latitude} + 0.005`
      )
      .then((data) => {
        res.status(200).send(data.rows);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
  getFullMap: (req, res) => {
    let longitude = JSON.parse(req.query.longitude);
    let latitude = JSON.parse(req.query.latitude);

    dbHelpers.query(`SELECT * FROM citations WHERE longitude BETWEEN ${longitude} - 0.50 AND ${longitude} + 0.50 AND latitude BETWEEN ${latitude} - 0.050 AND ${latitude} + 0.050` )
  }
};
