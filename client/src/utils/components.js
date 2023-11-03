
export const environment = `${process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BACKEND : process.env.REACT_APP_PROD_BACKEND}`

export const validPlaylistIdChecker = (playlistId) => {
    const playlistIdRegex1 = /playlist\/.{22}/
    const playlistIdRegex2 = /.{22}/

    if(playlistIdRegex1.test(playlistId)) {
        return playlistId.split('/').pop()
    }

    if(playlistIdRegex2.test(playlistId)) {
        return playlistId
    }

    return false
}

export const getPlaylistInfoFromLocalStorage = () => {
    const localStoragePlaylistInfo = window?.localStorage?.playlistInfo
    const playlistInfo = localStoragePlaylistInfo ? JSON.parse(localStoragePlaylistInfo) : []
    return playlistInfo
}

export const setUserPlaylistInfoInLocalStorage = (userPlaylists) => {
    window.localStorage.setItem("playlistInfo", userPlaylists)
}


export const addNewPlaylistInfoToLocalStorage = (newPlaylistInfo) => {
    const localStoragePlaylistInfo = window?.localStorage?.playlistInfo
    var parsedLocalStoragePlaylistInfo = localStoragePlaylistInfo ? JSON.parse(localStoragePlaylistInfo) : []
    parsedLocalStoragePlaylistInfo.push(newPlaylistInfo)
    window.localStorage.setItem("playlistInfo", JSON.stringify(parsedLocalStoragePlaylistInfo))
}


export const updatePlaylistInfoInLocalStorage = (newPlaylistInfo) => {
    const localStoragePlaylistInfo = window?.localStorage?.playlistInfo
    var parsedLocalStoragePlaylistInfo = JSON.parse(localStoragePlaylistInfo)
    var oldPlaylistIndex = parsedLocalStoragePlaylistInfo.findIndex((playlistInfo) => playlistInfo.playlistId === newPlaylistInfo.playlistId)
    // replace old playlistinfo with new playlistinfo
    parsedLocalStoragePlaylistInfo[oldPlaylistIndex] = newPlaylistInfo
    window.localStorage.setItem("playlistInfo", JSON.stringify(parsedLocalStoragePlaylistInfo))
}

export const deletePlaylistInfoFromLocalStorage = (playlistObjectId) => {
    const localStoragePlaylistInfo = window?.localStorage?.playlistInfo
    var newLocalStorage = JSON.parse(localStoragePlaylistInfo).filter((info) => info._id !== playlistObjectId)
    window.localStorage.setItem("playlistInfo", JSON.stringify(newLocalStorage))
}

export const playlistExistsInLocalStorage = (validPlaylistId, returnPlaylist=false) => {
    const localStoragePlaylistInfo = window?.localStorage?.playlistInfo
    if(localStoragePlaylistInfo) {
      const parsedLocalStoragePlaylistInfo = JSON.parse(localStoragePlaylistInfo)
      const currentPlaylistIds = parsedLocalStoragePlaylistInfo.map((info) => info.playlistId)
      if(currentPlaylistIds.includes(validPlaylistId)) {
        if(returnPlaylist) {
            const foundPlaylist = parsedLocalStoragePlaylistInfo.find((playlist) => {
                return playlist.playlistId === validPlaylistId
            })
            return foundPlaylist
        }
        return true
      }
    }
    return false
}

export const setUserInfoInLocalStorage = (data) => {
    window.localStorage.setItem("userInfo", JSON.stringify({
        id: data.userID || data.id,
        email: data.userEmail || data.email,
        username: data.username
    }))
}

export const getUserInfoFromLocalStorage = () => {
    const userInfo = window?.localStorage?.userInfo
    if(userInfo) {
        return JSON.parse(userInfo)
    }
    return false
}

export const deleteAllPlaylistInfoFromLocalStorage = () => {
    window.localStorage.removeItem("playlistInfo")
}

export const clearAppInfo = () => {
    window.localStorage.removeItem("userInfo")
    window.localStorage.removeItem("playlistInfo")
}
