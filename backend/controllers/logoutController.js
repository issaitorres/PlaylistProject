const { User } = require('../model/User')

const handleLogout = async (req, res) => {

    // need cookie parser in server for this to work
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(200).json({'message': 'no jwt cookie'})
    const refreshToken = cookies.jwt

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec()

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(200).json({ 'message': 'cleared cookie'})
    }

    // delete refreshtoken in db
    foundUser.refreshToken = ''
    const result = await foundUser.save()

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.status(200).json({ 'message': 'cleared cookie'})
}

module.exports = { handleLogout }