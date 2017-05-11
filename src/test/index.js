'use strict'

const jwt = require('../lib/jwt-utils');
const expect = require('chai').expect


describe('jwt-utils', () => {  

    it('should export decode function', () => {
        expect(jwt.decode).to.be.a('function');
    });

});


describe('decode', () => {

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ";
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

});