const axios = require('axios');

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

module.exports = { GenerateAccessTokenOrGetFromEnvVar }