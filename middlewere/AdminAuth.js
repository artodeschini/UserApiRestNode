const secret = require('./screct');
const jwt = require('jsonwebtoken'); 

module.exports = function(req, res, next) {
    const authorization = req.headers['authorization'];

    if (authorization != undefined) {
        const bear = authorization.split(' ');
        const token =  bear[1];

        try {
            let decode = jwt.verify(token, secret);
            console.log(decode);

            if (decode.role == 1) {
                next();
            } else {
                res.status(401);
                res.send('você nao está autorizado');
            }
    
        } catch (error) {
            console.log(error);
            
            res.status(401);
            res.send('você nao está autorizado');
        }
        
    } else {
        res.status(401);
        res.send('você nao está autorizado');
    }
}
