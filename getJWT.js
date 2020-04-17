const jwt = require("jsonwebtoken");

module.exports = function getJWT(callback) {
    const iss = process.env.SERVERID;
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60; //JWTの有効期間は1時間
    const cert = Buffer.from(process.env.PRIVATEKEY.replace(/\\n/g, "\n"));
    jwt.sign(
        { iss: iss, iat: iat, exp: exp },
        cert,
        { algorithm: "RS256" },
        (err, jwttoken) => {
        if (!err) {
            callback(jwttoken);
        } else {
            console.log("getJWT Error: ", err);
        }
    });
}