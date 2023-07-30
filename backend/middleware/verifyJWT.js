const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ 'message': 'missing authorization'});
    const token = authHeader.split(' ')[1];


    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            // if(err) return res.status(403).json({ 'message': 'err in jwt verify'})
            if(err) return res.status(403).json({ 'message': `err in jwt verify ${err}`})

            req.email = decoded.UserInfo.email
            req.mongoUserId = decoded.UserInfo.mongoUserId
            next()
        }
    )
}

module.exports = { verifyJWT }