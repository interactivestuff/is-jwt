
const crypto = require('crypto');


//public functions


module.exports.decode = function decode(token, key) {

    let parts = token.split(".");

    if (parts.length !== 3) throw new Error('Wrong token format');

    let headerStr = parts[0];
    let claimStr = parts[1];
    let signStr = parts[2];

    var headerJson = JSON.parse(base64urlDecode(headerStr));

    if(headerJson.alg !== "HS256") throw new Error('Algorithm not supported');

    let testSignStr = getSign(headerStr, claimStr, key);

    if(testSignStr !== signStr) throw new Error('Signature verification failed');

    let claimJson = JSON.parse(base64urlDecode(claimStr));

    return claimJson;

};


//private functions


function getSign(header, claim, key){
    
    let hmac = crypto.createHmac('sha256', key);
    hmac.update(header+"."+claim); 
    let base64 = hmac.digest('base64');

    return base64UrlEscape(base64);

}//getSign


function base64urlDecode(str) {

  return new Buffer(base64UrlUnescape(str), 'base64').toString();

}//base64urlDecode


function base64urlEncode(str) {

    return base64UrlEscape(new Buffer(str).toString('base64'));

}//base64urlEncode


function base64UrlUnescape(str) {

    //replace "-" with "+" and "_" with "/" and adds the right number of "=" at the end of the string 

    str += new Array(5 - str.length % 4).join('=');
    return str.replace(/\-/g, '+').replace(/_/g, '/');

}//base64UrlUnescape


function base64UrlEscape(str) {

    //replace "+" with "-" and "/" with "_" and removes "=" at the end of the string 

    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

}//base64UrlEscape