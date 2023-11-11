const { User } = require('../model/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const handleLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ 'message': 'email and password are required.' });

    const foundUser = await User.findOne({ email: email }).exec()
    if (!foundUser) return res.status(401).json({'message': `Couldn't find user with email: ${email}`}); //Unauthorized 

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {

        // create access token
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "mongoUserId": foundUser.id,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '7d' } // must match time in seconds for accessToken in client pages/auth/login
        )
        const refreshToken = jwt.sign(
            { 
                'email': foundUser.email,
                "mongoUserId": foundUser.id
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        )

        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()

        res.cookie('jwt', refreshToken, { 
            httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000, // matches with refresh token - uses milliseconds,
            sameSite: 'None', 
            secure: true
        })

        res.json({ 
            accessToken, 
            userID: foundUser.id, 
            userEmail: foundUser.email,
            username: foundUser.userName
         });
    } else {
        res.status(401).json({ 'message': 'email or password is incorrect'});

    }
}

module.exports = { handleLogin }