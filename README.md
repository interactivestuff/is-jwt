# is-jwt-utils
Just a jwt library without dependencies

## Install

    $ npm install is-jwt-utils

## Usage

```javascript
var jwt = require('is-jwt-utils');
let claim = jwt.decode(token, secretKey);
console.log(claim);
```

### Algorithms

The only algorithm supported at this time is `HS256`.
