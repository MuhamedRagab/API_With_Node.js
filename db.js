const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();
let dbConnection = "";
const uri = process.env.CONNECTION_STRING;

module.exports = {
  connectDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        console.log("Connected");
        return cb();
      })
      .catch((err) => {
        console.error(err);
        cb(err);
      });
  },
  getDb: () => dbConnection,
};
