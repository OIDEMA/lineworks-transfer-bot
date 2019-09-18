"use strict";

const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const https = require("https");
const request = require("request");
const qs = require("querystring");
const express = require("express");
const server = express();

const APIID = process.env.APIID;
const SERVERID = process.env.SERVERID;
const CONSUMERKEY = process.env.CONSUMERKEY;
const PRIVATEKEY = process.env.PRIVATEKEY;
const BOTNO = process.env.BOTNO;

server.listen(process.env.PORT || 3000);

server.post("/callback", (req, res) => {
  res.sendStatus(200);
});
