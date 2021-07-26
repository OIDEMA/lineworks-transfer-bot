// module読み込み
const request = require('request');
const axios = require('axios');

module.exports = async function sendToDepartment(messageText, token, accountId) {
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
    if (err) {
      console.log("error send message: ", err);
      return;
    }
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
        console.log(res.data)
        return res.data
      })
      return "質問内容："+ "\n" + messageText + "\n\n" + "質問者ID：" + accountId  + "\n" + "質問者：" +  account.name + "\n" +　"所属部署：" + account.representOrgUnitName
    } catch (e) {
      console.log(e)
    }
  }
};