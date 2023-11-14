const axios = require('axios');
var querystring = require('querystring');
const { environment } = require("../config/utilities")


const GenerateAccessTokenOrGetFromEnvVar = async () => {
    const spotifyAccessToken = process.env.SPOTIFY_ACCESS_TOKEN

    if (spotifyAccessToken && !accessTokenExpired()) {
        return spotifyAccessToken
    } else {
        const accessToken = await GenerateToken()
        //write new access token and time to env
        recordNewAccessTokenAndExpirationTime(accessToken, Date.now())
        return accessToken
    }
}

const GenerateToken = async () => {
    const spotifyAPITokenUrl = "https://accounts.spotify.com/api/token"
    const res = await axios.post(spotifyAPITokenUrl, null, {
        params: {
            'grant_type': 'client_credentials',
            'client_id': process.env.SPOTIFY_CLIENT_ID,
            'client_secret': process.env.SPOTIFY_CLIENT_SECRET
            },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })

    return res.data.access_token
}

const accessTokenExpired = () => {
    const expirationTime = Number(process.env.SPOTIFY_ACCESS_TOKEN_EXPIRATION_TIME)
    if (expirationTime < Date.now()) {
        return true
    } else {
        // expired
        return false
    }
}

const recordNewAccessTokenAndExpirationTime = async (accessToken, currentTime) => {
    const ONE_HOUR = 60 * 60 * 1000; /* ms */
    const res = await EditEnvValue("SPOTIFY_ACCESS_TOKEN", accessToken)
    const res2 = await EditEnvValue("SPOTIFY_ACCESS_TOKEN_EXPIRATION_TIME", currentTime + ONE_HOUR)
}

const EditEnvValue = async (envKey, envNewValue) => {
    const os = require("os");
    const fsPromises = require('fs').promises

    try {
        const envFile = await fsPromises.readFile('./.env', "utf8",) 
        const envLines = envFile.split(os.EOL)
        const envKeyValues = {}

        for (let line of envLines) {
            const [envLineKey, ...rest] = line.split('=')
            const envLineValue = rest.join('=')
            const envLineArray = [envLineKey, envLineValue]
            envKeyValues[envLineArray[0]] = envLineArray[1]
        }

        // create env value if doesn't exist or update it
        envKeyValues[envKey] = envNewValue
        const newEnvLines = []
        Object.keys(envKeyValues).map(b => newEnvLines.push(`${b}=${envKeyValues[b]}`))
        const writeEnvFile = await fsPromises.writeFile("./.env", newEnvLines.join(os.EOL))
        
    } catch (err) {
        console.log(err)
    }
}

const generateTokensWithScope = async (authorizationCode) => {
    const spotifyAPITokenUrl = "https://accounts.spotify.com/api/token"
    const redirectUri = environment

    try {
        const res = await axios.post(spotifyAPITokenUrl,
            {
                code: authorizationCode,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            },
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
                }
            }
        )

        return {
            accessToken: res.data.access_token,
            refreshToken: res.data.refresh_token,
        }

    } catch (err) {
        console.log(err)
        return false
    }
}

const generateSpotifyServiceUrl = () => {
    const spotify_multiple_albums_url = 'https://accounts.spotify.com/authorize?'
    const state = generateRandomString(16);
    const redirectUri = environment
    const scope = 'playlist-read-private user-library-read'

    const queryString = querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: redirectUri,
      state: state
    });

    return [spotify_multiple_albums_url + queryString, state]
}

const generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const generateNewSpotifyUserTokens = async (refreshToken) => {
    const spotify_access_token_url = "https://accounts.spotify.com/api/token";

    try {
        const res = await axios.post(spotify_access_token_url,
            {
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            },
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
                }
            }
        )
        return {
            accessToken: res.data.access_token,
            refreshToken: res.data.refresh_token
        }
    } catch (err) {
        return false
    }

}


module.exports = {
    GenerateAccessTokenOrGetFromEnvVar,
    generateSpotifyServiceUrl,
    generateTokensWithScope,
    generateNewSpotifyUserTokens
}
