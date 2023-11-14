const {
    generateSpotifyServiceUrl,
    generateTokensWithScope
} = require('../config/GetAccessToken')
const {
    getUserPlaylists,
    getUserDisplayName
} = require('../config/spotifyUserPlaylistInformation')
const jwt = require('jsonwebtoken');

const ONE_HOUR = 60 * 60 * 1000; /* ms */
const ONE_DAY = 24 * 60 * 60 * 1000; /* ms */

const handleLogin = async (req, res) => {
    const [spotifyServiceUrl, state] = generateSpotifyServiceUrl()
    res.cookie('spotifyLoginState', state, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // matches with refresh token - uses milliseconds
        sameSite: 'None',
        secure: true
    })

    res.status(200).json({ 'spotifyServiceUrl': spotifyServiceUrl });
}


const getAccessToken = async (req, res) => {
    const storedSpotifyLoginState = req?.cookies?.spotifyLoginState
    const { authorizationCode, state } = req.body

    // cookie state must match
    if (storedSpotifyLoginState === state) {
        res.clearCookie('spotifyLoginState', { httpOnly: true, sameSite: 'None', secure: true });
        const tokens = await generateTokensWithScope(authorizationCode)

        if(tokens) {
            const accessToken = tokens.accessToken
            const refreshToken = tokens.refreshToken
            const userPlaylistData = await getUserPlaylists(accessToken)
            const profileData = await getUserDisplayName(accessToken)

            if(userPlaylistData) {
                const currentTime = Date.now()
                const spotifyUserAccessToken = encodeSpotifyUserAccessToken(accessToken, currentTime)
                const spotifyUserRefreshToken = encodeSpotifyUserRefreshToken(refreshToken, currentTime)

                res.cookie('spotifyUserAccessToken', spotifyUserAccessToken, {
                    httpOnly: true,
                    maxAge: ONE_HOUR, // uses milliseconds
                    sameSite: 'None',
                    secure: true
                })
                res.cookie('spotifyUserRefreshToken', spotifyUserRefreshToken, {
                    httpOnly: true,
                    maxAge: ONE_DAY, // uses milliseconds
                    sameSite: 'None',
                    secure: true
                })

                res.status(200).json({ 
                    'userPlaylistData': userPlaylistData,
                    'spotifyUserAccessToken': spotifyUserAccessToken,
                    'spotifyUserRefreshToken': spotifyUserRefreshToken,
                    'profileData': profileData
                });
            } else {
                res.status(400).json({"message": "error retrieving user playlists"})
            }
        } else {
            res.status(400).json({"message": "error getting access and refresh tokens"})
        }
    } else {
        res.status(400).json({'message': "spotify login states don't match"})
    }
}

const encodeSpotifyUserAccessToken = (accessToken, currentTime) => {
    const spotifyUserAccessToken = jwt.sign(
        {
            "SpotifyUserInfo": {
                "accessToken": accessToken,
                "expirationTime": currentTime + ONE_HOUR
            }
        },
        process.env.SPOTIFY_ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' } // must match time in seconds for accessToken in client pages/home
    )

    return spotifyUserAccessToken
}

const encodeSpotifyUserRefreshToken = (refreshToken, currentTime) => {
    const spotifyUserRefreshToken = jwt.sign(
        {
            "SpotifyUserInfo": {
                "refreshToken": refreshToken,
                "expirationTime": currentTime + ONE_DAY
            }
        },
        process.env.SPOTIFY_REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' } // must match time in seconds for accessToken in client pages/home
    )
    return spotifyUserRefreshToken
}

const decodeSpotifyUserAccessToken = (spotifyUserAccessToken) => {
    const accessTokenAndExpirationTime = jwt.verify(
        spotifyUserAccessToken,
        // req.cookies.spotifyUserAccessToken,
        process.env.SPOTIFY_ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.log(err)
                return false
            }

            return {
                "accessTokenWithScope": decoded.SpotifyUserInfo.accessToken,
                "accessTokenExpirationTime": decoded.SpotifyUserInfo.expirationTime
            }
        }
    )
    return accessTokenAndExpirationTime
}

const decodeSpotifyUserRefreshToken = (spotifyUserRefreshToken) => {
    const refreshTokenAndExpirationTime = jwt.verify(
        spotifyUserRefreshToken,
        process.env.SPOTIFY_REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.log(err)
                return false
            }
            return {
                "refreshTokenWithScope": decoded.SpotifyUserInfo.refreshToken,
                "refreshTokenExpirationTime": decoded.SpotifyUserInfo.expirationTime
            }
        }
    )
    return refreshTokenAndExpirationTime
}

module.exports = {
    handleLogin,
    getAccessToken,
    encodeSpotifyUserAccessToken,
    encodeSpotifyUserRefreshToken,
    decodeSpotifyUserAccessToken,
    decodeSpotifyUserRefreshToken
}
