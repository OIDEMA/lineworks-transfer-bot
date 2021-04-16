module.exports = function sendToDepartment(messageText, token, accountId) {
  const request = require("request");
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
    } else if (messageText === "利用開始") {
      console.log('利用開始メッセージは送りません。')
      process.exit(0);
    }
  });
};
