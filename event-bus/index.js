const express = require("express");
const axios = require("axios");

const app = express();

const events = [];

app.use(express.json());

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post("http://localhost:4000/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:5000/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:7000/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:8000/events", event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(6000, () => {
  console.log("Listening on 6000..");
});
