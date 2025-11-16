const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("hello"));

app.listen("8000", (err) => {
  if (err) throw err;
  else console.log(`the server is running`);
});
