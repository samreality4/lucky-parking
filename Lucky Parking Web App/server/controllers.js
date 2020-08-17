dbHelpers = require("../database/index.js");
var fetchCounter = 0

module.exports = {
  getAll: (req, res) => {
    let longitude = JSON.parse(req.query.longitude);
    let latitude = JSON.parse(req.query.latitude);
    let zoom = parseFloat(JSON.parse(req.query.zoom));

    let rangeLong = (zoom) => zoom >= 13 ? 0.2 : 0.2
    let rangeLat = (zoom) => zoom >= 13? 0.090 : 0.090
     
    dbHelpers
      .query(
        `SELECT * FROM citations WHERE longitude BETWEEN ${longitude} - ${rangeLong(zoom)} AND ${longitude} + ${rangeLong(zoom)} AND latitude BETWEEN ${latitude} - ${rangeLat(zoom)} AND ${latitude} + ${rangeLat(zoom)}`
      )
      .then((data) => {
        fetchCounter ++
        console.log(fetchCounter)
        res.status(200).send(data.rows);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
};
