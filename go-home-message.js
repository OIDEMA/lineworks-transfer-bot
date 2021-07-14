const request = require("request");

module.exports = function sendToDepartment(token) {
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
          text: "終業時刻5分前です。退勤ボタンを忘れないように。"
        }
      }
    };
    request.post(postData, (err, response, body) => {
      if (err) {
        console.log("error send message: ", err);
        return;
      }
    });
  };
