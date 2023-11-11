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

    // delete refreshtoken for user in db
    foundUser.refreshToken = ''
    const result = await foundUser.save()

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.status(200).json({ 'message': 'cleared cookie'})

    // these cookies are cleared when user manually logs out from Spotify in the AddPlaylist component
    // res.clearCookie('spotifyUserAccessToken', { httpOnly: true, sameSite: 'None', secure: true });
    // res.clearCookie('spotifyUserRefreshToken', { httpOnly: true, sameSite: 'None', secure: true });
}

const spotifyLogout = async (req, res) => {
    res.clearCookie('spotifyUserAccessToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.clearCookie('spotifyUserRefreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    return res.status(200).json({ 'message': 'spotify cookies cleared'})
}

module.exports = { handleLogout, spotifyLogout }