"use strict";

// node modules
const bodyParser = require("body-parser");
const express = require("express");
const server = express();

// declared modules
const SendToDepartment = require("./send-to-department");
const SendToQuestioner = require("./send-to-questioner");
const SendImageToDepartment = require("./send-image-to-department");
const SendStickerToDepartment = require("./send-sticker-to-department");
const getJWT = require("./getJWT");
const getServerToken = require("./get-server-token");

// const RegEmail = /^([A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,})\n/;
const RegEmail = /^([A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,})\n/;

server.use(bodyParser.json());
server.listen(process.env.PORT || 3000);

server.post("/callback", (req, res) => {
  res.sendStatus(200);

  // Content-Type
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
          SendToQuestioner(newtoken, matchAccountId[1], replaceAnswerMessage);
        } else if (roomId !== process.env.LINE_IT_TALKROOMID) {
          SendToDepartment(messageText, newtoken, accountId);
        }
      });
    });
  } else if (contentType === "sticker") {
    const stickerId = req.body.content.stickerId;
    const packageId = req.body.content.packageId;
    getJWT(jwttoken => {
      getServerToken(jwttoken, newtoken => {
        if (roomId !== process.env.LINE_IT_TALKROOMID) {
          SendStickerToDepartment(newtoken, stickerId, packageId);
        }
      });
    });
  } else if (contentType === "image") {
    const resourceId = req.body.content.resourceId;
    getJWT(jwttoken => {
      getServerToken(jwttoken, newtoken => {
        if (roomId !== process.env.LINE_IT_TALKROOMID) {
          SendImageToDepartment(newtoken, resourceId);
        }
      });
    });
  } else if (contentType === "file") {
    console.log(req.body.content)
    const resourceId = req.body.content.resourceId;
    getJWT(jwttoken => {
      getServerToken(jwttoken, newtoken => {
        if (roomId !== process.env.LINE_IT_TALKROOMID) {
          SendImageToDepartment(newtoken, resourceId);
        }
      });
    });
  }
});
