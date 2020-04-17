const request = require("request");

module.exports = function getServerToken(jwttoken, callback) {
    const APIID = process.env.APIID;
    const postdata = {
      url: "https://authapi.worksmobile.com/b/" + APIID + "/server/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      form: {
        grant_type: encodeURIComponent(
          "urn:ietf:params:oauth:grant-type:jwt-bearer"
        ),
        assertion: jwttoken
      }
    };
    request.post(postdata, (error, response, body) => {
      if (error) {
        console.log("Error getServerToken: ", error);
        callback(error);
      } else {
        const jsonobj = JSON.parse(body);
        const AccessToken = jsonobj.access_token;
        callback(AccessToken);
      }
    });
}