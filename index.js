"use strict";

const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const https = require("https");
const request = require("request");
const qs = require("querystring");
const express = require("express");
const server = express();
const SendToDepartment = require("./send-to-department");

const APIID = process.env.APIID;
const SERVERID = process.env.SERVERID;
const CONSUMERKEY = process.env.CONSUMERKEY;
const PRIVATEKEY = process.env.PRIVATEKEY;
const BOTNO = process.env.BOTNO;

server.listen(process.env.PORT || 3000);

// RoomIdの確認も入れるしかないのか
server.post("/callback", (req, res) => {
  res.sendStatus(200);
  const messageText = req.body.content.text;
  const roomId = req.body.source.roomId;
  const accountId = req.body.source.accountId;
  getJWT(jwttoken => {
    getServerToken(jwttoken, newtoken => {
      fetchTelNumber(qnaInput, newtoken, accountId);
    });
  });
});

// JWTの更新と取得
function getJWT(callback) {
  const iss = SERVERID;
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60; //JWTの有効期間は1時間
  const cert = Buffer.from(PRIVATEKEY.replace(/\\n/g, "\n"));
  jwt.sign(
    { iss: iss, iat: iat, exp: exp },
    cert,
    { algorithm: "RS256" },
    (err, jwttoken) => {
      if (!err) {
        callback(jwttoken);
      } else {
        console.log("getJWT Error: ", err);
      }
    }
  );
}

// Server Tokenの取得
function getServerToken(jwttoken, callback) {
  const postdata = {
    url: "https://authapi.worksmobile.com/b/" + APIID + "/server/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    form: {
      grant_type: encodeURIComponent(
        "urn:ietf:params:oauth:grant-type:jwt-bearer"
      ),
      assertion: jwttoken
    }
  };
  request.post(postdata, (error, response, body) => {
    if (error) {
      console.log("Error getServerToken: ", error);
      callback(error);
    } else {
      const jsonobj = JSON.parse(body);
      const AccessToken = jsonobj.access_token;
      callback(AccessToken);
    }
  });
}
