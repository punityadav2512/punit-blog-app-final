const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const connectToDB = require('./config/db');
// const cloudinary = require('cloudinary').v2;
const path = require('path');
const auth = require('./routes/auth');
const blogs = require('./routes/blogs');
// const fs = require('fs');

// initialize app
const app = express();

// include .env
require('dotenv').config();

// connect to Db
connectToDB();

// use middlewares
app.use(cors());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());


app.use("/images", express.static(path.join(__dirname + '/images')));
app.use("/blogs", express.static(path.join(__dirname + '/blogs')));
app.use("/", express.static(path.join(__dirname + '/public')))

// routes

app.use('/api/auth', auth);
app.use('/api/blogs', blogs);


app.use((req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"))
})

const port = process.env.PORT || process.env.APP_PORT;


// listen to app
app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
})