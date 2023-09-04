const getTrackDataColumnHeaders = () => {
  return (
    {
        "#": {
            keyName: "#",
        },
        "Song": {
            keyName: "song",
        },
        "Song Pop.": {
            keyName: "songPop"
        },
        "Artist": {
            keyName: "artist",
        },
        "Genre": {
            keyName: "genres"
        },
        "Album": {
            keyName: "album",
        },
        "Album Pop.": {
            keyName: "albumPop",
        }, 
        "Album Year": {
            keyName: "albumReleaseYear",
        },
        "BPM": {
            keyName: "bpm",
        },
        "Energy": {
            keyName: "energy",
            convertType: "percent"
        },
        "Happiness": {
            keyName: "valence",
            convertType: "percent"
        },
        "Danceability": {
            keyName: "danceability",
            convertType: "percent"
        },
        "Instrumentalness": {
            keyName: "instrumentalness",
            convertType: "percent"
        },
        "Speechiness": {
            keyName: "speechiness",
            convertType: "percent"
        },
        "Liveness": {
            keyName: "liveness",
            convertType: "percent"},
        "Acousticness": {
            keyName: "acousticness",
            convertType: "percent"
        },
        "Key": {
            keyName: "key",
            convertType: "key"     
        },
        "Mode": {
            keyName: "mode",
            convertType: "mode"
        },
        "Time Signature": {
            keyName: "time_signature",
            convertType: "time_signature"
        },
        "Loudness (db)": {
            keyName: "loudness",
            convertType: "db"
        },
        "Explicit": {
            keyName: "explicit",
            convertType: "bool"
        },
        "Duration": {
            keyName: "duration",
            convertType: "duration"
        },
    }
  )
}

export default getTrackDataColumnHeaders