/*
  解码和验证 JWT
  但貌似这个验证没多大
*/

class JWTPayload{

  constructor(token) {
    this.payload = this.decodePayload(token);
  }

  /* 解token
   * token JSONWebToken
   * return payload object
   */
  decodePayload(token) {
    try {
      let payloadEncoded = token.split('.')[1];
      let buffer = wx.base64ToArrayBuffer(payloadEncoded);
      let payloadDecoded = String.fromCharCode.apply(null, new Uint8Array(buffer));
      return JSON.parse(payloadDecoded)
    } catch (err) {
      console.error(err);
      return null
    }
  }


  /* 验证是否有效
   * return boolean
   */
  isValid() {
    try {
      if (this.payload && this.payload.exp) {
        let timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        // console.log(timestamp)
        return this.payload.exp > timestamp;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  }
}

module.exports = JWTPayload