"use strict";

// node modules
const bodyParser = require("body-parser");
const express = require("express");
const server = express();
const cron = require('node-cron');

// declared modules
const SendToDepartment = require("./send-to-department");
const SendToQuestioner = require("./send-to-questioner");
const SendImageToDepartment = require("./send-image-to-department");
const SendStickerToDepartment = require("./send-sticker-to-department");
const goHome = require("./go-home-message");
// who send files
const shareSender = require("./share-sender");
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
    const sender = req.body.source.accountId;

    getJWT(jwttoken => {
      getServerToken(jwttoken, newtoken => {
        if (roomId !== process.env.LINE_IT_TALKROOMID) {
          SendStickerToDepartment(newtoken, stickerId, packageId);
          shareSender(newtoken, sender, contentType);
        }
      });
    });
  } else if (contentType === "image") {
    const resourceId = req.body.content.resourceId;
    const sender = req.body.source.accountId;

    getJWT(jwttoken => {
      getServerToken(jwttoken, newtoken => {
        if (roomId !== process.env.LINE_IT_TALKROOMID) {
          SendImageToDepartment(newtoken, resourceId);
          shareSender(newtoken, sender, contentType);
        }
      });
    });
  } else if (contentType === "file") {
    const resourceId = req.body.content.resourceId;
    const sender = req.body.source.accountId;

    getJWT(jwttoken => {
      getServerToken(jwttoken, newtoken => {
        if (roomId !== process.env.LINE_IT_TALKROOMID) {
          SendImageToDepartment(newtoken, resourceId);
          shareSender(newtoken, sender, contentType);
        }
      });
    });
  }
});

// 定時に特定のメッセージを送付する
cron.schedule('0 55 17 * * 1-5', () => {
  getJWT(jwttoken => {　
      getServerToken(jwttoken, newtoken => {
        goHome(newtoken);
      })
  })
}, {
  scheduled: true,
  timeZone: 'Asia/Tokyo',
});
