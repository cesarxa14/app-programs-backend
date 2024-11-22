const jwt = require('jsonwebtoken');
require('dotenv').config();
async function verifyToken(req, res, next){
    try{
        const {authorization} = req.headers;
        // console.log('authorization', authorization)
        const token = authorization.split(' ')[1];
        console.log('token', token);
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
            if(err){
                throw err;
            }
            res.locals.id = data.id;

            next();
        });

    } catch(err) {
        res.status(400).json({message: 'Unauthorized'});
    }
    
}

module.exports = {verifyToken};