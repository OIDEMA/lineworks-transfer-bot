"use strict";

require("dotenv").config();
const bodyParser = require("body-parser");
// const jwt = require("jsonwebtoken");
// const request = require("request");
const express = require("express");
const server = express();
const SendToDepartment = require("./send-to-department");
const SendToQuestioner = require("./send-to-questioner");
const SendStickerToDepartment = require("./send-sticker-to-department");
const SendImageToDepartment = require("./send-image-to-department");

const getJWT = require("./getJWT")
const getServerToken = require("./get-server-token")

// const APIID = process.env.APIID;
// const SERVERID = process.env.SERVERID;
// const PRIVATEKEY = process.env.PRIVATEKEY;

// const RegEmail = /^([A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,})\n/;
const RegEmail = /^([A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,})\n/;

server.use(bodyParser.json());
server.listen(process.env.PORT || 3000);

// RoomIdの確認も入れるしかないのか
server.post("/callback", (req, res) => {
  res.sendStatus(200);

  // Content-Typeの修正
  const contentType = req.body.content.type
  const roomId = req.body.source.roomId;
  const accountId = req.body.source.accountId;


  if (contentType === "text") {
    const messageText = req.body.content.text;
    getJWT(jwttoken => {
      getServerToken(jwttoken, newtoken => {
        if (RegEmail.test(messageText)) {
          const matchAccountId = messageText.match(/([A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,})\n/);
          const replaceAnswerMessage = messageText.replace(RegEmail, "");
          SendToQuestioner(newtoken, matchAccountId[1], replaceAnswerMessage); // 配列のところはもう少し考えなくてはいけないな
        } else if (roomId !== process.env.LINE_IT_TALKROOMID) {
          SendToDepartment(messageText, newtoken, accountId);
        }
      });
    });
  } else if (contentType === "sticker") {
    const stickerId = req.body.content.stickerId;
    const packagedId = req.body.content.packageId;
    getJWT(jwttoken => {
      getServerToken(jwttoken, newtoken => {
        SendStickerToDepartment(newtoken, stickerId, packagedId);
      });
    });
  } else if (contentType === "image") {
    const resourceId = req.body.content.resourceId;
    getJWT(jwttoken => {
      getServerToken(jwttoken, newtoken => {
        SendImageToDepartment(newtoken, resourceId);
      });
    });
  }
});

  
// JWTの更新と取得
// function getJWT(callback) {
//  const iss = SERVERID;
//  const iat = Math.floor(Date.now() / 1000);
//  const exp = iat + 60 * 60; //JWTの有効期間は1時間
//  const cert = Buffer.from(PRIVATEKEY.replace(/\\n/g, "\n"));
//  jwt.sign(
//    { iss: iss, iat: iat, exp: exp },
//    cert,
//    { algorithm: "RS256" },
//    (err, jwttoken) => {
//      if (!err) {
//        callback(jwttoken);
//      } else {
//        console.log("getJWT Error: ", err);
//      }
//    }
//  );
//},

// Server Tokenの取得
//function getServerToken(jwttoken, callback) {
//  const postdata = {
//    url: "https://authapi.worksmobile.com/b/" + APIID + "/server/token",
//    headers: {
//      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
//    },
//    form: {
//      grant_type: encodeURIComponent(
//        "urn:ietf:params:oauth:grant-type:jwt-bearer"
//      ),
//      assertion: jwttoken
//    }
//  };
//  request.post(postdata, (error, response, body) => {
//    if (error) {
//      console.log("Error getServerToken: ", error);
//      callback(error);
//    } else {
//      const jsonobj = JSON.parse(body);
//      const AccessToken = jsonobj.access_token;
//      callback(AccessToken);
//    }
//  });
// });
