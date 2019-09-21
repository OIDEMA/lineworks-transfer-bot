module.exports = function sendToDepartment() {
  const request = require("request");
  const ROOTURL = process.env.ROOT_URL_LINEWORKS;
  const PATHCOMMON_MESSAGE = process.env.PATHCOMMON_MESSAGE;
  const BOTNO = process.env.BOTNO;
  const HEADERS = {
    "Content-Type": "application/json; charset=UTF-8"
  };
  const postData = {
    roomId: "", //
    content: {
      type: "text",
      text: "" // 質問内容と質問者を記載する
    }
  };
};
