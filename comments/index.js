const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

const commentByPostId = {};

app.use(express.json());
app.use(cors());

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(40).toString("hex");
  const { content } = req.body;

  const comments = commentByPostId[req.params.id] || [];

  comments.push({
    id: commentId,
    content,
    status: "pending",
  });
  commentByPostId[req.params.id] = comments;

  await axios.post("http://localhost:6000/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log("Received events", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    console.log("data++", data);
    const { postId, id, status } = data;
    const comments = commentByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
  }

  res.send({});
});

app.listen(5000, () => {
  console.log("Listening on 5000..");
});
