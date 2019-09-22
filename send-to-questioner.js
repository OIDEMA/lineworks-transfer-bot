module.exports = function SendToQuestioner(token, accountId, answerMessage) {
  const request = require("request");
  const APIID = process.env.APIID;
  const CONSUMERKEY = process.env.CONSUMERKEY;
  const BOTNO = process.env.BOTNO;
  const postDataQuestion = {
    url: "https://apis.worksmobile.com/" + APIID + "/message/sendMessage/v2",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      consumerKey: CONSUMERKEY,
      Authorization: "Bearer " + token
    },
    json: {
      botNo: Number(BOTNO),
      accountId: accountId,
      content: {
        type: "text",
        text: answerMessage
      }
    }
  };
  request.post(postDataQuestion, (err, res, body) => {
    if (err) {
      console.log("Error AnswerMessage: ", err);
      return;
    }
    console.log("answerMessage: ", body);
  });
};
