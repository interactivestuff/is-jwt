# is-jwt-utils
Just a jwt library without dependencies

## Install

    $ npm install is-jwt-utils

## Usage

```javascript
var jwt = require('is-jwt-utils');

const secretKey = "secret";

const timeOptions = {  "issuedAt" : true,  "notBefore" : 0, "expiration" : 60*60 };
const claims = {"email" : "email@email.com", "admin" : true};

const token = jwt.encode(timeOptions, claims, secretKey);
console.log(token);

const payload = jwt.decode(token, secretKey);
console.log(payload);
```

### Time options

The time options could have 3 properties:
- issuedAt
- notBefore
- expiration

"issuedAt" is a boolean, and if is set to true, the iss claim is added to the token.
"notBefore" indicates the number of seconds, from this moment, that have to be waited before the token can be valid.
"expiraton" indicates the number of seconds, from this moment, that the token will be valid.

### Algorithms

The only algorithm supported at this time is `HS256`.
