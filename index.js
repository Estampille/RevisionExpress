const express = require("express");
const connection = require("./connection");

const port = process.env.PORT || 5000;
const app = express();

app.listen(port, (err) => {
  if (err) {
    console.error("Warning", err);
  } else {
    console.log("Server runing on", port);
  }
});
