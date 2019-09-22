module.exports = function CheckRoomId(token, roomId, accountId) {
  const request = require("request");
  const BOTNO = process.env.BOTNO;
  const CONSUMERKEY = process.env.CONSUMERKEY;
  const APIID = process.env.APIID;
  // const ROOTURL_LINE = process.env.ROOT_URL_LINEWORKS;
  // const PATH_SENDMESSAGE = process.env.PATH_SEND_MESSAGE;
  const postDataForRoomId = {
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
        text: String(roomId)
      }
    }
  };
  request.post(postDataForRoomId, (err, res, body) => {
    if (err) {
      console.log("Error checkRoomId: ", err);
      return;
    }
    console.log("postDataForRoomId: ", body);
  });
};
