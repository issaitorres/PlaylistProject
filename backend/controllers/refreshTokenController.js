const { User } = require('../model/User')
const jwt = require('jsonwebtoken');


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).json({ 'message': 'cookie jwt not found or expired'})
    const refreshToken = cookies.jwt

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec()
    
    if (!foundUser) return res.status(403).json({ 'message': 'user not found'})

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.id !== decoded.mongoUserId) return res.status(403).json({ 'message': 'err or ids do not match'})

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": decoded.email,
                        "mongoUserId": foundUser.id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s'}
            )
            res.json({accessToken})
        }
    )
}

module.exports = { handleRefreshToken }