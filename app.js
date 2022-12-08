const express = require("express");
const { ObjectId } = require("mongodb");
const { connectDb, getDb } = require("./db");
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(express.json());

let db;

connectDb((err) => {
  if (!err) {
    app.listen(port, () => console.log("localhost:3000 is running..."));
    db = getDb();
  } else throw err;
});

app.get("/data", (req, res) => {
  const data = [],
    dataSelected = +req.query.d || 0;

  if (dataSelected && dataSelected > 0) {
    db.collection("testDB")
      .find()
      .sort({ name: 1 })
      .skip(dataSelected - 1)
      .limit(1)
      .forEach((item) => data.push(item))
      .then(() => res.status(200).json(data))
      .catch(() =>
        res.status(500).json({ err: "Couldn`t fetch the documents" })
      );
  } else {
    db.collection("testDB")
      .find()
      .sort({ name: 1 })
      .forEach((item) => data.push(item))
      .then(() => res.status(200).json(data))
      .catch(() =>
        res.status(500).json({ err: "Couldn`t fetch the documents" })
      );
  }
});

app.get("/data/:id", (req, res) => {
  let { id } = req.params;

  if (ObjectId.isValid(id)) {
    db.collection("testDB")
      .findOne({ _id: ObjectId(id) })
      .then((doc) => res.status(200).json(doc))
      .catch(() =>
        res.status(500).json({ err: "Couldn`t fetch the documents" })
      );
  } else {
    res.status(500).json({ err: "Not a valid doc id" });
  }
});

app.post("/setData", (req, res) => {
  const data = req.body;

  db.collection("testDB")
    .insertOne(data)
    .then((result) => res.status(200).json(result))
    .catch(() => res.status(500).json({ err: "Couldn`t create a new doc" }));
});

app.delete("/deleteData/:id", (req, res) => {
  let { id } = req.params;

  if (ObjectId.isValid(id)) {
    db.collection("testDB")
      .deleteOne({ _id: ObjectId(id) })
      .then((doc) => res.status(200).json(doc))
      .catch(() =>
        res.status(500).json({ err: "Couldn`t delete the documents" })
      );
  } else {
    res.status(500).json({ err: "Not a valid doc id" });
  }
});

app.patch("/updateData/:id", (req, res) => {
  const [{ body }, { id }] = [req, req.params];

  if (ObjectId.isValid(id)) {
    db.collection("testDB")
      .updateOne({ _id: ObjectId(id) }, { $set: body })
      .then((doc) => res.status(200).json(doc))
      .catch(() =>
        res.status(500).json({ err: "Couldn`t update the documents" })
      );
  } else {
    res.status(500).json({ err: "Not a valid doc id" });
  }
});
