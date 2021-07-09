// module読み込み
const request = require('request');
const axios = require('axios');

module.exports = function sendToDepartment(messageText, token, accountId) {
  const BOTNO = process.env.BOTNO;
  const APIID = process.env.APIID;
  const CONSUMERKEY = process.env.CONSUMERKEY;

  const postData = {
    url: "https://apis.worksmobile.com/" + APIID + "/message/sendMessage/v2",
    headers: {
      consumerKey: CONSUMERKEY,
      Authorization: "Bearer " + token
    },
    json: {
      botNo: Number(BOTNO),
      roomId: process.env.LINE_IT_TALKROOMID,
      content: {
        type: "text",
        text: "「" + messageText + "」\n" + accountId // 質問内容と質問者を記載する
      }
    }
  };
  request.post(postData, (err, response, body) => {
    if (err) {
      console.log("error send message: ", err);
      return;
    }
  });

  const body = {
    "app": 5,
    "record": {
        "questioner": {
            "value": accountId
        },
        "description": {
            "value": messageText
        }
    }
  }
  axios({
    method: 'post',
    url: 'https://ckhspb2zfv9t.cybozu.com/k/v1/record.json',
    data: body,
    headers: {
      "X-Cybozu-API-Token": process.env.accessToken,
      "Content-Type": 'application/json'
    },
  }).then((res) => {
    console.log(res.data)
  }).catch((error) => {
    console.log(error);
  });
};