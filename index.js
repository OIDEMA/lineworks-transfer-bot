"use strict";

const express = require("express");
const server = express();

server.listen(process.env.PORT || 3000);

server.post("/callback", (req, res) => {
  res.sendStatus(200);
});
