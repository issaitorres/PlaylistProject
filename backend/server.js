require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const dbConn = require('./config/dbConn')
const { verifyJWT } = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3500;

// connect to mongoose
dbConn()

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());
app.use(logger)

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://spotifyplaylistanalyzer.onrender.com"
    ],
    credentials: true,
}))

//middleware for cookies
app.use(cookieParser());

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'))
app.use('/spotify-login', require('./routes/spotifyLogin'))

// special route only for mongo db queries
    // - add middleware only for this route to verify this command comes from server

// app.use('/db', require('./routes/db'));
// router.delete('/deletepastweek', playlistsController.deletePlaylistObjectsNotUpdatedInPastWeek) - current in routes/login



// routes where login is required
app.use(verifyJWT)
app.use('/playlists', require('./routes/playlists'));
app.use('/user', require('./routes/user'));



app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('connect to mongodb')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

})
