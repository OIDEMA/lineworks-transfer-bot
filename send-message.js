module.exports = function sendMessage(token, accountId, message) {
    const request = require("request");
    const BOTNO = process.env.BOTNO;
    const CONSUMERKEY = process.env.CONSUMERKEY;
    const API_ID = process.env.APIID;
    const postData = {
        url = "https://apis.worksmobile.com/" + API_ID + "/message/sendMessage/v2",
        headers: {
            consumerKey: CONSUMERKEY,
            Authorization: "Bearer " + token
        },
        json: {
            botNo: Number(BOTNO),
            accountId: accountId,
            content: {
                type: "text",
                text: message
            }
        }
    };
    request.post(postData, (err, res, body) => {
        if (err) {
            console.log("Error SendMessage: ", err);
            return;
        }
    })
  };
  