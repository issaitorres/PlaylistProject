const axios = require('axios');
const GenerateToken = async () => {
    const spotifyClientId = process.env.SPOTIFY_CLIENT_ID
    const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const spotifyAPITokenUrl = "https://accounts.spotify.com/api/token"

    const res = await axios.post(spotifyAPITokenUrl, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        // body: `grant_type=client_credentials&client_id=${spotifyClientId}&client_secret=${spotifyClientSecret}`,

    })
    return true


    // const response = await fetch(url, {
    //     body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
    //     headers: {
    //         "Content-Type": "application/x-www-form-urlencoded"
    //     },
    //     method: "POST"
    // })
    // const jsonData = await response.json();

    // return jsonData["access_token"]
}

GenerateToken()