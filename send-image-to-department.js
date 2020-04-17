module.exports = function sendIamgeToDepartment(token, resourceId) {
    const request = require("request");
    const BOTNO = process.env.BOTNO;
    const API_ID = process.env.APIID;
    const CONSUMERKEY = process.env.CONSUMERKEY;

    const postData = {
      url: "https://apis.worksmobile.com/" + API_ID + "/message/sendMessage/v2",
      headers: {
        consumerKey: CONSUMERKEY,
        Authorization: "Bearer " + token
      },
      json: {
        botNo: Number(BOTNO),
        roomId: process.env.LINE_IT_TALKROOMID,
        content: {
          type: "image",
          resourceId: resourceId
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