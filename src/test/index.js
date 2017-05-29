'use strict'

const jwt = require('../lib/jwt-utils');
const expect = require('chai').expect;


describe('jwt-utils', () => {  

    it('should export encode function', () => {
        expect(jwt.encode).to.be.a('function');
    });

    it('should export decode function', () => {
        expect(jwt.decode).to.be.a('function');
    });

    it('should encode and decode a token', () => {

        const key = "secret";

        const timeOptions = {  "issuedAt" : true,  "notBefore" : 0, "expiration" : 60*60 };
        const claims = {"claim1" : "a", "claim2" : "b"};
        
        const token = jwt.encode(timeOptions, claims, key);
        const decodedPayload = jwt.decode(token, key);

        expect(decodedPayload).to.have.property('claim1').to.be.equal('a');
        expect(decodedPayload).to.have.property('claim2').to.be.equal('b');

    });

});


describe('encode', () => {
    
    const key = "secret";

    it('sholud return a string', () => {

        const timeOptions = { "issuedAt" : true, "notBefore" : 0, "expiration" : 60*60 };
        const claims = {"claim1" : "a", "claim2" : "b"};

        const token = jwt.encode(timeOptions, claims, key);

        expect(token).to.be.a('String');

    });

});


describe('decode', () => {

    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImVtYWlsQGVtYWlsLmNvbSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTQ5NjA1MTg4MSwiZXhwIjoxNDk2MDU1NDgxfQ.76D_kPKDwlNgbpV8fScLoF-a_GjZq7UWP8wZ4grhzWY";
    const secretKey = "secret";
    const wrongFormatToken = "asdsad.dfdfd";
    const wrongJsonToken = "asdsad.dfdfd.sdfsdf";
    const wrongAlgorithmToken = "eyJhbGciOiJIUzI1NyIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.5yyDIgBJKR0ACULfOv84sAXfWtrdtmaJrcqg43ir_aQ";
    const wrongSecretKey = "secretWrong";

    it('sholud return an object', () => {

        let claim = jwt.decode(token, secretKey);
        expect(claim).to.be.a('object');

    });

    it('should throw an error when the token format is wrong', () => {

        let call = () => jwt.decode(wrongFormatToken, secretKey);
        expect(call).to.throw(Error, /Wrong token format/);

    });

    it('should throw an error when the parts are not json', () => {

        let call = () => jwt.decode(wrongJsonToken, secretKey);
        expect(call).to.throw(Error, /Unexpected token/);

    });

    it('should throw an error when the algorithm is not supported', () => {

        let call = () => jwt.decode(wrongAlgorithmToken, secretKey);
        expect(call).to.throw(Error, /Algorithm not supported/);

    });

     it('should throw an error when the signature is not verified', () => {

        let call = () => jwt.decode(token, wrongSecretKey);
        expect(call).to.throw(Error, /Signature verification failed/);

    });


    it('should throw an error because the token is not yet valid', () => {

        const timeOptions = {  "issuedAt" : true,  "notBefore" : 30, "expiration" : 60*60 };
        const claims = {"claim1" : "a", "claim2" : "b"};
        
        const token = jwt.encode(timeOptions, claims, secretKey);

        let call = () => jwt.decode(token, secretKey);
        expect(call).to.throw(Error, /This token can not be used before:/);

    });


    it('should throw an error because the token is expired', () => {

        const timeOptions = {  "issuedAt" : true,  "notBefore" : 0, "expiration" : 1 };
        const claims = {"claim1" : "a", "claim2" : "b"};
        
        const token = jwt.encode(timeOptions, claims, secretKey);
        
        const start = Math.floor(new Date());
        let now = 0;

        do{
            
            now = Math.floor(new Date());

        }while(now - start < 1500 );

        let call = () => jwt.decode(token, secretKey);
        expect(call).to.throw(Error, /This token is expired at:/);

    });

});