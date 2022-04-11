const jwt = require('jsonwebtoken');


//This is a middleware function!
module.exports = function(req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('access denied!');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET); //Thi returns the id of the user
        req.user = verified;    //req.user is accessable througout the route because this middleware function assigned value to req.user
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}