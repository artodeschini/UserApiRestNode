const secret = require('./screct');
const jwt = require('jsonwebtoken'); 

module.exports = function(req, res, next) {
    const authorization = req.headers['authorization'];

    if (authorization != undefined) {
        const bear = authorization.split(' ');
        const token =  bear[1];
        // console.log(token);

        try {
            jwt.verify(token, secret.secret,  (error, decode) => {
                if (error) {
                    res.status(401);
                    res.send({message:"Token verificado invalido"});
    
                } else {
                   
                    console.log(decode);
                    // req.token = token;
                    // req.loggedUser = {'id': data.id, email: data.email};
                    if (decode.role == 1) {
                        next();
                    } else {
                        res.status(401);
                        res.send('você nao está autorizado');
                    }
                    // next();
                }
            });

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
