
const crypto = require('crypto');


module.exports.encode = function encode(timeOptions, claims, key){

    let header = { typ: 'JWT', alg: 'HS256' };
    let headerJson = JSON.stringify(header);
    let headerBase64 = base64urlEncode(headerJson);

    let payload = claims;

    const now = Math.floor(new Date() / 1000);

    if(timeOptions.issuedAt === true) payload.iat = now;
    if(timeOptions.notBefore > 0) payload.nbf = now+timeOptions.notBefore;
    if(timeOptions.expiration > 0) payload.exp = now+timeOptions.expiration;

    let payloadJson = JSON.stringify(payload);
    let payloadBase64 = base64urlEncode(payloadJson);

    let signatureBase64 = sign(headerBase64, payloadBase64, key);

    return headerBase64+"."+payloadBase64+"."+signatureBase64;

}//encode


module.exports.decode = function decode(token, key) {

    let parts = token.split('.');

    if (parts.length !== 3) throw new Error('Wrong token format');

    let header = parts[0];
    let payload = parts[1];
    let signature = parts[2];

    let headerBase64 = base64urlDecode(header);
    var headerJson = JSON.parse(headerBase64);

    if(headerJson.alg !== 'HS256') throw new Error('Algorithm not supported');

    let testSignature = sign(header, payload, key);

    if(testSignature !== signature) throw new Error('Signature verification failed');

    let payloadBase64 = base64urlDecode(payload);
    let payloadJson = JSON.parse(payloadBase64);

    const now = Math.floor(new Date() / 1000);

    if(payloadJson.exp !== null && now > payloadJson.exp) throw new Error('This token is expired at: '+payloadJson.exp);
    if(payloadJson.nbf !== null && now < payloadJson.nbf) throw new Error('This token can not be used before: '+payloadJson.nbf);

    return payloadJson;

};


//private functions


function sign(header, payload, key){
    
    let hmac = crypto.createHmac('sha256', key);
    hmac.update(header+"."+payload); 
    let base64 = hmac.digest('base64');

    return base64UrlEscape(base64);

}//sign


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