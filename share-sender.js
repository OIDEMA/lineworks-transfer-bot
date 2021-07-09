module.exports = function shareSender(token, accountId, contentType) {
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
            text: await getAccountInfo()
        }
        }
    };
    request.post(postData, (err, response, body) => {
        console.log("error send message: ", err);
        return;
    });
    async function getAccountInfo() {
        try {
          const account = await axios({
            method: 'get',
            url: `https://apis.worksmobile.com/r/${APIID}/contact/v2/accounts/${accountId}`,
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              consumerKey: CONSUMERKEY,
              Authorization: "Bearer " + token
            }
          }).then((res) => {
            return res.data
          })
          return "ID：" + accountId  + "\n" + `${account.name}さんが${contentType}を送信しました。` +  account.name + "\n" +　"所属部署：" + account.representOrgUnitName
        } catch (e) {
          console.log(e)
        }
      }
};